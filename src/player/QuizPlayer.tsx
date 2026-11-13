/**
 * The lesson / test player. One screen per step, a big Check button, and a feedback sheet.
 *
 * mode 'lesson':     wrong answers are re-queued at the end (you finish once everything is right).
 *                    Code exercises are retried in place.
 * mode 'checkpoint': each mistake costs a heart; run out and the attempt ends. No re-queue.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step } from '../content/types';
import { StepView, correctAnswerText, type CheckHandle } from './steps';
import { Markdown } from '../components/Markdown';
import { sfx } from './sfx';

export interface PlayResult {
  /** Questions answered right on the first try / total questions. */
  accuracy: number;
  correctFirstTry: number;
  totalQuestions: number;
  heartsLeft: number;
  failedOut: boolean;
  /** Indexes (into `steps`) of questions answered wrong at least once. */
  missed: number[];
  /** Indexes of questions the learner actually answered (a failed test can end early). */
  answered: number[];
}

interface Props {
  /** Shown small above the progress bar (lesson or test name). */
  title?: string;
  steps: Step[];
  mode: 'lesson' | 'checkpoint';
  hearts?: number;
  onFinish: (r: PlayResult) => void;
  onExit: () => void;
}

const PRAISE = ['Nice!', 'Great job!', 'You got it!', 'Excellent!', 'Correct!', 'Nailed it!', 'Awesome!'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Status = 'answering' | 'checking' | 'correct' | 'wrong';

export function QuizPlayer({ title, steps, mode, hearts: startHearts = 3, onFinish, onExit }: Props) {
  // queue holds indexes into `steps`
  const [queue, setQueue] = useState<number[]>(() => steps.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [status, setStatus] = useState<Status>('answering');
  const [hearts, setHearts] = useState(startHearts);
  const [praise, setPraise] = useState(PRAISE[0]);
  const [codeFails, setCodeFails] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);
  const missed = useRef(new Set<number>());
  const answered = useRef(new Set<number>());
  const check = useRef<CheckHandle>({ enabled: false, run: () => false });
  const [canCheck, setCanCheck] = useState(false);

  const stepIdx = queue[pos];
  const step = steps[stepIdx];
  const isQuestion = step.kind !== 'explain';
  /** Code and terminal exercises are retried in place during lessons instead of re-queued. */
  const handsOn = step.kind === 'code' || step.kind === 'terminal';
  const totalQuestions = steps.filter((s) => s.kind !== 'explain').length;

  const setCheck = useCallback((c: CheckHandle) => {
    check.current = c;
    setCanCheck(c.enabled);
  }, []);

  useEffect(() => setCodeFails(0), [pos]);

  const finish = useCallback((failedOut: boolean, heartsLeft: number) => {
    const correctFirstTry = totalQuestions - missed.current.size;
    if (!failedOut) sfx.finish();
    onFinish({ accuracy: totalQuestions ? correctFirstTry / totalQuestions : 1, correctFirstTry, totalQuestions, heartsLeft, failedOut, missed: [...missed.current], answered: [...answered.current] });
  }, [onFinish, totalQuestions]);

  const doCheck = async () => {
    if (!canCheck || status !== 'answering') return;
    if (!isQuestion) return advance();
    setStatus('checking');
    const ok = await check.current.run();
    answered.current.add(stepIdx);
    if (ok) {
      sfx.correct();
      setPraise(pick(PRAISE));
      setStatus('correct');
    } else {
      sfx.wrong();
      missed.current.add(stepIdx);
      if (mode === 'checkpoint') setHearts((h) => h - 1);
      setStatus('wrong');
    }
  };

  function advance(requeue = false) {
    let q = queue;
    if (requeue) {
      q = [...queue, stepIdx];
      setQueue(q);
    }
    if (mode === 'checkpoint' && hearts <= 0) return finish(true, 0);
    if (pos + 1 >= q.length) return finish(false, hearts);
    setPos(pos + 1);
    setStatus('answering');
  }

  const onContinueWrong = () => {
    if (mode === 'lesson' && handsOn) { setStatus('answering'); return; } // retry in place
    advance(mode === 'lesson');
  };

  // Enter = primary action
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey || confirmExit) return;
      // Enter inside the code editor or the practice terminal belongs to them.
      if ((e.target as HTMLElement)?.closest?.('.cm-editor, .terminal')) return;
      e.preventDefault();
      if (status === 'answering') doCheck();
      else if (status === 'correct') advance();
      else if (status === 'wrong') onContinueWrong();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const progressPct = Math.round((pos / queue.length) * 100);
  const answerText = correctAnswerText(step);
  const explanation = 'explanation' in step ? step.explanation : undefined;

  return (
    <div className={`player mode-${mode}`}>
      <header className="player-top">
        <button className="icon-btn" aria-label="Quit" onClick={() => setConfirmExit(true)}>✕</button>
        <div className="progress-wrap">
          {title && <div className="player-title">{title}</div>}
          <div className="progress-track" role="progressbar" aria-label="Progress" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${Math.max(progressPct, 3)}%` }} />
          </div>
        </div>
        {mode === 'checkpoint' && <div className="hearts" aria-label={`${hearts} hearts left`}>❤️ {hearts}</div>}
      </header>

      <main className="player-body">
        <StepView key={pos} step={step} locked={status !== 'answering'} setCheck={setCheck} onAttempt={setCodeFails} />
      </main>

      <footer className={`player-bottom status-${status}`}>
        {status === 'correct' && (
          <div className="feedback">
            <div className="feedback-title">✅ {praise}</div>
            {explanation && <div className="feedback-text"><Markdown text={explanation} /></div>}
          </div>
        )}
        {status === 'wrong' && (
          <div className="feedback">
            <div className="feedback-title">{step.kind === 'code' ? '🔧 Not quite — check the output above' : step.kind === 'terminal' ? '🔧 Not quite — see what\'s missing above' : '❌ Not quite'}</div>
            {answerText && !(handsOn && mode === 'lesson') && <div className="feedback-text"><strong>{step.kind === 'terminal' ? 'One solution:' : 'Correct answer:'}</strong> {answerText}</div>}
            {explanation && !handsOn && <div className="feedback-text"><Markdown text={explanation} /></div>}
            {handsOn && mode === 'lesson' && <div className="feedback-text">{step.kind === 'code' ? 'Compare your output with what was expected, or tap 💡 Hint.' : 'Fix it with more commands (or press Reset terminal), or tap 💡 Hint.'}</div>}
            {mode === 'lesson' && !handsOn && <div className="feedback-note">You'll see this one again at the end.</div>}
          </div>
        )}
        <div className="bottom-actions">
          {status === 'wrong' && mode === 'lesson' && handsOn && codeFails >= 2 && (
            <button className="btn btn-ghost" onClick={() => advance(false)}>Skip for now</button>
          )}
          {status === 'answering' || status === 'checking' ? (
            <button className="btn btn-primary btn-wide" disabled={!canCheck || status === 'checking'} onClick={doCheck}>
              {status === 'checking' ? 'Checking…' : isQuestion ? 'Check' : 'Continue'}
            </button>
          ) : status === 'correct' ? (
            <button className="btn btn-success btn-wide" onClick={() => advance()}>Continue</button>
          ) : (
            <button className="btn btn-danger btn-wide" onClick={onContinueWrong}>
              {mode === 'lesson' && handsOn ? 'Try again' : 'Got it'}
            </button>
          )}
        </div>
      </footer>

      {confirmExit && (
        <div className="modal-backdrop" onClick={() => setConfirmExit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Leave now?</h3>
            <p>Your progress in this {mode === 'lesson' ? 'lesson' : 'test'} will be lost.</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => setConfirmExit(false)}>Keep going</button>
              <button className="btn btn-ghost" onClick={onExit}>Quit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
