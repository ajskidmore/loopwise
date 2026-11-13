/**
 * Full-screen pages that run the QuizPlayer: lessons, unit checkpoints, final exams and review.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getLesson, getTrack, getUnit } from '../content';
import type { Checkpoint, Step } from '../content/types';
import { QuizPlayer, type PlayResult } from '../player/QuizPlayer';
import { useProgress } from '../progress/ProgressContext';
import {
  CHECKPOINT_XP, LESSON_XP, PERFECT_BONUS, REVIEW_XP, applyLessonResult, applyReviewResult, applyTestResult,
  currentStreak, isLessonUnlocked, updateMistakes, type Progress,
} from '../progress/model';
import { newlyEarned, type Achievement } from '../progress/achievements';
import { buildReview, checkpointKey, lessonKey } from '../review';
import { Pip } from '../components/Pip';
import { Confetti } from '../components/Confetti';

type Line = { label: string; value: string; tone?: string };

function Results({ title, subtitle, lines, mood, badges = [], primary, secondary }: {
  title: string; subtitle?: string; lines: Line[]; mood: 'cheer' | 'sad' | 'happy'; badges?: Achievement[];
  primary: { label: string; onClick: () => void }; secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className={`results mood-${mood}`}>
      {mood === 'cheer' && <Confetti />}
      <Pip size={140} mood={mood} className={mood === 'cheer' ? 'bounce' : ''} />
      <h1>{title}</h1>
      {subtitle && <p className="muted results-sub">{subtitle}</p>}
      <div className="result-cards">
        {lines.map((l) => (
          <div key={l.label} className={`result-card tone-${l.tone ?? 'xp'}`}>
            <div className="result-label">{l.label}</div>
            <div className="result-value">{l.value}</div>
          </div>
        ))}
      </div>
      {badges.length > 0 && (
        <div className="new-badges" role="status">
          {badges.map((b) => (
            <div key={b.id} className="new-badge">
              <span className="badge-icon">{b.icon}</span>
              <span><strong>New achievement: {b.title}</strong><br /><span className="muted small">{b.description}</span></span>
            </div>
          ))}
        </div>
      )}
      <div className="results-actions">
        {secondary && <button className="btn btn-ghost" onClick={secondary.onClick}>{secondary.label}</button>}
        <button className="btn btn-primary btn-wide" onClick={primary.onClick} autoFocus>{primary.label}</button>
      </div>
    </div>
  );
}

function Missing({ text, back }: { text: string; back: string }) {
  return (
    <div className="results">
      <Pip size={110} mood="think" />
      <h1>{text}</h1>
      <Link to={back} className="btn btn-primary">Back to the path</Link>
    </div>
  );
}

/** Keys of missed and correctly-answered questions, for Review mode. */
function mistakeKeys(steps: Step[], r: PlayResult, keyFor: (i: number) => string) {
  const missed = new Set(r.missed);
  const answered = new Set(r.answered);
  const wrong: string[] = [];
  const right: string[] = [];
  steps.forEach((s, i) => {
    if (s.kind === 'explain' || !answered.has(i)) return;
    (missed.has(i) ? wrong : right).push(keyFor(i));
  });
  return { wrong, right };
}

/** Apply a progress change and report which achievements it unlocked. */
function useApply() {
  const { progress, update } = useProgress();
  return (fn: (p: Progress) => Progress): Achievement[] => {
    const after = fn(progress);
    update(fn);
    return newlyEarned(progress, after);
  };
}

// ------------------------------------------------------------------ lesson
export function LessonPage() {
  const { lessonId = '' } = useParams();
  const navigate = useNavigate();
  const { progress } = useProgress();
  const apply = useApply();
  const [result, setResult] = useState<{ r: PlayResult; xp: number; badges: Achievement[] } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const found = getLesson(lessonId);

  if (!found) return <Missing text="We couldn't find that lesson." back="/learn" />;
  const { lesson, unit, track, index } = found;
  const back = `/learn/${track.id}#${unit.id}`;
  const unitIndex = track.units.indexOf(unit);

  if (lesson.status !== 'ready' || !lesson.steps) {
    return <Missing text={`"${lesson.title}" is coming soon!`} back={back} />;
  }
  if (!result && !isLessonUnlocked(progress, track.id, unitIndex, index)) {
    return (
      <div className="results">
        <Pip size={110} mood="think" />
        <h1>This lesson is locked 🔒</h1>
        <p className="muted">Finish the lessons before it — or pass this unit's checkpoint to test out.</p>
        <div className="results-actions">
          <Link to={back} className="btn btn-ghost">Back</Link>
          {unit.checkpoint && <Link to={`/checkpoint/${unit.id}`} className="btn btn-primary">Take the checkpoint</Link>}
        </div>
      </div>
    );
  }

  if (result) {
    const nextL = unit.lessons[index + 1];
    const toCheckpoint = !(nextL?.status === 'ready') && unit.checkpoint && !progress.units[unit.id];
    const goNext = () => {
      setResult(null);
      setAttempt((a) => a + 1);
      if (nextL?.status === 'ready') navigate(`/lesson/${nextL.id}`);
      else if (toCheckpoint) navigate(`/checkpoint/${unit.id}`);
      else navigate(back);
    };
    return (
      <Results
        title="Lesson complete!"
        subtitle={lesson.title}
        mood="cheer"
        badges={result.badges}
        lines={[
          { label: 'XP earned', value: `+${result.xp}`, tone: 'xp' },
          { label: 'Accuracy', value: `${Math.round(result.r.accuracy * 100)}%`, tone: 'acc' },
          { label: 'Streak', value: `🔥 ${currentStreak(progress)}`, tone: 'fire' },
        ]}
        primary={{ label: nextL?.status === 'ready' ? 'Next lesson' : toCheckpoint ? 'Take the checkpoint' : 'Continue', onClick: goNext }}
        secondary={{ label: 'Back to path', onClick: () => navigate(back) }}
      />
    );
  }

  return (
    <QuizPlayer
      key={`${lessonId}-${attempt}`}
      title={lesson.title}
      steps={lesson.steps}
      mode="lesson"
      onExit={() => navigate(back)}
      onFinish={(r) => {
        const base = LESSON_XP + (r.accuracy === 1 ? PERFECT_BONUS : 0);
        const xp = progress.lessons[lesson.id] ? Math.ceil(base / 2) : base;
        const { wrong, right } = mistakeKeys(lesson.steps!, r, (i) => lessonKey(lesson.id, i));
        const badges = apply((p) => updateMistakes(applyLessonResult(p, { lessonId: lesson.id, xp: base, accuracy: r.accuracy }), wrong, right));
        setResult({ r, xp, badges });
      }}
    />
  );
}

// ------------------------------------------------------------------ tests (checkpoint / final)
function TestRunner({ kind, id, title, test, back }: { kind: 'unit' | 'track'; id: string; title: string; test: Checkpoint; back: string }) {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const apply = useApply();
  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ r: PlayResult; passed: boolean; badges: Achievement[]; xp: number } | null>(null);
  const prev = kind === 'unit' ? progress.units[id] : progress.tracks[id];

  if (!started) {
    return (
      <div className="results">
        <Pip size={120} mood="happy" />
        <div className="eyebrow">{kind === 'unit' ? 'Checkpoint' : 'Final exam'}</div>
        <h1>{title}</h1>
        <ul className="test-rules">
          <li>📝 {test.questions.length} questions</li>
          <li>❤️ {test.hearts} hearts — each mistake costs one</li>
          <li>🎯 Score {Math.round(test.passScore * 100)}% or more to pass</li>
          {prev && <li>✅ You already passed with {Math.round(prev.bestScore * 100)}%</li>}
        </ul>
        <div className="results-actions">
          <button className="btn btn-ghost" onClick={() => navigate(back)}>Not yet</button>
          <button className="btn btn-primary btn-wide" onClick={() => setStarted(true)} autoFocus>Start</button>
        </div>
      </div>
    );
  }

  if (result) {
    const { r, passed } = result;
    return (
      <Results
        title={passed ? (kind === 'unit' ? 'Checkpoint passed! 🏆' : 'Course complete! 🎓') : r.failedOut ? 'Out of hearts' : 'Almost there!'}
        subtitle={passed ? title : 'Review the lessons and try again — you can retake it anytime.'}
        mood={passed ? 'cheer' : 'sad'}
        badges={result.badges}
        lines={[
          { label: 'Score', value: `${Math.round(r.accuracy * 100)}%`, tone: passed ? 'acc' : 'bad' },
          { label: 'Needed', value: `${Math.round(test.passScore * 100)}%`, tone: 'xp' },
          ...(passed ? [{ label: 'XP earned', value: `+${result.xp}`, tone: 'xp' }] : []),
        ]}
        primary={passed ? { label: 'Continue', onClick: () => navigate(back) } : { label: 'Try again', onClick: () => { setResult(null); setAttempt((a) => a + 1); } }}
        secondary={passed ? undefined : { label: 'Review lessons', onClick: () => navigate(back) }}
      />
    );
  }

  return (
    <QuizPlayer
      key={attempt}
      title={title}
      steps={test.questions}
      mode="checkpoint"
      hearts={test.hearts}
      onExit={() => navigate(back)}
      onFinish={(r) => {
        const passed = !r.failedOut && r.accuracy >= test.passScore;
        const xp = prev ? Math.ceil(CHECKPOINT_XP / 2) : CHECKPOINT_XP * (kind === 'track' ? 2 : 1);
        // Final-exam questions aren't tracked as mistakes (they're a summary of the units).
        const keys = kind === 'unit' ? mistakeKeys(test.questions, r, (i) => checkpointKey(id, i)) : { wrong: [], right: [] };
        const badges = apply((p) => updateMistakes(applyTestResult(p, kind, id, r.accuracy, passed), keys.wrong, keys.right));
        setResult({ r, passed, badges, xp });
      }}
    />
  );
}

export function CheckpointPage() {
  const { unitId = '' } = useParams();
  const found = getUnit(unitId);
  if (!found?.unit.checkpoint) return <Missing text="This checkpoint isn't ready yet." back="/learn" />;
  const { unit, track } = found;
  return <TestRunner key={unit.id} kind="unit" id={unit.id} title={unit.title} test={unit.checkpoint!} back={`/learn/${track.id}#${unit.id}`} />;
}

export function FinalExamPage() {
  const { trackId = '' } = useParams();
  const track = getTrack(trackId);
  if (!track?.finalExam) return <Missing text="This final exam isn't ready yet." back="/learn" />;
  return <TestRunner key={track.id} kind="track" id={track.id} title={`${track.title} — Final exam`} test={track.finalExam} back={`/learn/${track.id}`} />;
}

// ------------------------------------------------------------------ review
export function ReviewPage() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const apply = useApply();
  const [attempt, setAttempt] = useState(0);
  // Build the session once per attempt (not on every progress change).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => buildReview(progress), [attempt]);
  const [result, setResult] = useState<{ r: PlayResult; badges: Achievement[]; fixed: number } | null>(null);

  if (items.length === 0) {
    return (
      <div className="results">
        <Pip size={120} mood="think" />
        <h1>Nothing to review yet</h1>
        <p className="muted">Finish a few lessons first. Questions you miss will show up here so you can practice them again.</p>
        <Link to="/learn" className="btn btn-primary">Go to my path</Link>
      </div>
    );
  }

  if (result) {
    return (
      <Results
        title="Review complete!"
        mood="cheer"
        badges={result.badges}
        lines={[
          { label: 'XP earned', value: `+${REVIEW_XP}`, tone: 'xp' },
          { label: 'Accuracy', value: `${Math.round(result.r.accuracy * 100)}%`, tone: 'acc' },
          { label: 'Mistakes fixed', value: `${result.fixed}`, tone: 'fire' },
        ]}
        primary={{ label: 'Done', onClick: () => navigate('/learn') }}
        secondary={{ label: 'Review again', onClick: () => { setResult(null); setAttempt((a) => a + 1); } }}
      />
    );
  }

  return (
    <QuizPlayer
      key={attempt}
      title="Review"
      steps={items.map((it) => it.step)}
      mode="lesson"
      onExit={() => navigate(-1)}
      onFinish={(r) => {
        const missed = new Set(r.missed);
        const wrong = items.filter((_, i) => missed.has(i)).map((it) => it.key);
        const right = items.filter((_, i) => !missed.has(i)).map((it) => it.key);
        const fixed = right.filter((k) => progress.mistakes[k]).length;
        const badges = apply((p) => applyReviewResult(p, wrong, right));
        setResult({ r, badges, fixed });
      }}
    />
  );
}
