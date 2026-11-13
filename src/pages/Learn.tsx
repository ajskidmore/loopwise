/**
 * The learning path: a winding trail of lesson nodes per unit, ending in a checkpoint.
 */
import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TRACKS, getTrack } from '../content';
import type { Track } from '../content/types';
import { useProgress } from '../progress/ProgressContext';
import { isLessonUnlocked, isUnitComplete, isUnitUnlocked, trackCompletion, type Progress } from '../progress/model';
import { Pip, PipSays } from '../components/Pip';
import { validMistakes } from '../review';

const LAST_TRACK = 'loopwise.lastTrack';
const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

export function rememberTrack(id: string) {
  try { localStorage.setItem(LAST_TRACK, id); } catch { /* ignore */ }
}
export function lastTrack(): string {
  try { return localStorage.getItem(LAST_TRACK) ?? TRACKS[0].id; } catch { return TRACKS[0].id; }
}

/** First unlocked, ready, not-yet-completed lesson in a track. */
export function nextLesson(p: Progress, track: Track) {
  for (let ui = 0; ui < track.units.length; ui++) {
    const unit = track.units[ui];
    for (let li = 0; li < unit.lessons.length; li++) {
      const l = unit.lessons[li];
      if (l.status === 'ready' && !p.lessons[l.id] && isLessonUnlocked(p, track.id, ui, li)) return l;
    }
  }
  return null;
}

export default function Learn() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { progress } = useProgress();
  const track = getTrack(trackId ?? lastTrack());

  useEffect(() => {
    if (track) rememberTrack(track.id);
  }, [track]);
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash, track]);

  if (!track) return <Navigate to="/learn" replace />;

  const comp = trackCompletion(progress, track.id);
  const next = nextLesson(progress, track);
  const reviewCount = validMistakes(progress).length;
  const prereqsMissing = track.prerequisites.filter((p) => trackCompletion(progress, p).done === 0);

  return (
    <div className="learn">
      <div className="learn-main">
        <div className="track-header" style={{ ['--accent' as string]: track.color }}>
          <div className="track-header-icon">{track.icon}</div>
          <div className="track-header-text">
            <div className="eyebrow">Course</div>
            <h1>{track.title}</h1>
            <p>{track.tagline}</p>
            <div className="mini-progress"><div style={{ width: `${(comp.done / comp.total) * 100}%` }} /></div>
            <div className="muted small">{comp.done}/{comp.total} lessons · {comp.ready} available now</div>
          </div>
          <select className="track-switch" value={track.id} onChange={(e) => navigate(`/learn/${e.target.value}`)} aria-label="Switch course">
            {TRACKS.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
          </select>
        </div>

        {reviewCount > 0 && (
          <div className="review-card">
            <span style={{ fontSize: '2rem' }} aria-hidden="true">🔁</span>
            <div className="grow"><strong>Review {reviewCount} missed question{reviewCount === 1 ? '' : 's'}</strong><div className="muted small">A quick session to lock in what you learned. +10 XP</div></div>
            <Link to="/review" className="btn btn-secondary btn-sm">Review</Link>
          </div>
        )}

        {prereqsMissing.length > 0 && (
          <PipSays mood="think" size={48}>
            Recommended first: {prereqsMissing.map((id, i) => (
              <span key={id}>{i > 0 && ', '}<Link to={`/learn/${id}`}>{getTrack(id)?.title}</Link></span>
            ))}. You can still explore this course!
          </PipSays>
        )}

        {track.units.map((unit, ui) => {
          const unlocked = isUnitUnlocked(progress, track.id, ui);
          const complete = isUnitComplete(progress, track.id, ui);
          const ready = unit.lessons.filter((l) => l.status === 'ready').length;
          return (
            <section key={unit.id} id={unit.id} className={`unit ${unlocked ? '' : 'unit-locked'}`}>
              <div className="unit-banner" style={{ background: unlocked ? track.color : undefined }}>
                <div>
                  <div className="unit-num">Unit {ui + 1}{complete && ' · ✓ Complete'}</div>
                  <h2>{unit.title}</h2>
                  <p>{unit.summary}</p>
                </div>
                {ready === 0 && <span className="soon-badge">Coming soon</span>}
              </div>
              <div className="path">
                {unit.lessons.map((l, li) => {
                  const done = !!progress.lessons[l.id];
                  const open = l.status === 'ready' && isLessonUnlocked(progress, track.id, ui, li);
                  const isNext = next?.id === l.id;
                  const cls = ['node', done && 'node-done', open && !done && 'node-open', !open && 'node-locked', l.status === 'planned' && 'node-planned', isNext && 'node-next']
                    .filter(Boolean).join(' ');
                  const body = (
                    <>
                      {isNext && <span className="node-start" aria-hidden="true">START</span>}
                      <span className="node-icon" aria-hidden="true">{done ? '✓' : l.status === 'planned' ? '…' : open ? '★' : '🔒'}</span>
                    </>
                  );
                  return (
                    <div key={l.id} className="node-row" style={{ transform: `translateX(${OFFSETS[li % OFFSETS.length]}px)` }}>
                      {open || done ? (
                        <Link to={`/lesson/${l.id}`} className={cls} style={{ ['--accent' as string]: track.color }} aria-label={`${isNext ? 'Start: ' : ''}${l.title}${done ? ' (done)' : ''}`}>{body}</Link>
                      ) : (
                        <span className={cls} role="img" title={l.status === 'planned' ? 'Coming soon' : 'Locked'} aria-label={`${l.title} (${l.status === 'planned' ? 'coming soon' : 'locked'})`}>{body}</span>
                      )}
                      <span className="node-label">{l.title}</span>
                    </div>
                  );
                })}
                {unit.checkpoint && (
                  <div className="node-row checkpoint-row">
                    <Link to={`/checkpoint/${unit.id}`} className={`node node-checkpoint ${progress.units[unit.id] ? 'node-done' : ''}`} aria-label={`${unit.title} checkpoint test`}>
                      <span className="node-icon" aria-hidden="true">🏆</span>
                    </Link>
                    <span className="node-label">
                      {progress.units[unit.id] ? `Checkpoint passed (${Math.round(progress.units[unit.id].bestScore * 100)}%)` : unlocked ? 'Checkpoint test' : 'Test out of this unit'}
                    </span>
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {track.finalExam && (
          <div className="final-row">
            <Link to={`/final/${track.id}`} className={`node node-checkpoint node-final ${progress.tracks[track.id] ? 'node-done' : ''}`} aria-label="Course final exam">
              <span className="node-icon" aria-hidden="true">🎓</span>
            </Link>
            <span className="node-label">
              {progress.tracks[track.id]
                ? `Final exam passed (${Math.round(progress.tracks[track.id].bestScore * 100)}%)`
                : `Final exam — pass it to complete ${track.title}`}
            </span>
          </div>
        )}
      </div>

      <aside className="learn-side">
        <div className="side-card">
          <Pip size={72} mood={next ? 'wave' : 'cheer'} />
          {next ? (
            <>
              <div className="side-title">Up next</div>
              <div className="side-text">{next.title}</div>
              <Link to={`/lesson/${next.id}`} className="btn btn-primary btn-wide">Continue</Link>
            </>
          ) : comp.done > 0 && comp.done === comp.ready ? (
            <div className="side-text">You've finished everything available in this course so far! New lessons are added regularly.</div>
          ) : (
            <div className="side-text">Pass the checkpoint to unlock the next unit.</div>
          )}
        </div>
        <div className="side-card">
          <div className="side-title">Your path</div>
          <ol className="path-list">
            {TRACKS.slice(0, 8).map((t) => {
              const c = trackCompletion(progress, t.id);
              return (
                <li key={t.id} className={t.id === track.id ? 'active' : ''}>
                  <Link to={`/learn/${t.id}`}>{t.icon} {t.title}</Link>
                  <span className="muted small">{c.done}/{c.total}</span>
                </li>
              );
            })}
          </ol>
          <Link to="/courses" className="small">See all {TRACKS.length} courses →</Link>
        </div>
      </aside>
    </div>
  );
}
