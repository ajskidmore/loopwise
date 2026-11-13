/**
 * Practice Arena: LeetCode-style problem list + solver page.
 */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PROBLEMS, getProblem } from '../content/problems';
import { getTrack } from '../content';
import { CodeView, type CheckHandle } from '../player/steps';
import { useProgress } from '../progress/ProgressContext';
import { PROBLEM_XP, applyProblemSolved } from '../progress/model';
import { PipSays } from '../components/Pip';
import { sfx } from '../player/sfx';

const DIFFS = ['all', 'intro', 'easy', 'medium', 'hard'] as const;

export default function Practice() {
  const { progress } = useProgress();
  const [diff, setDiff] = useState<(typeof DIFFS)[number]>('all');
  const [tag, setTag] = useState('');
  const [q, setQ] = useState('');
  const tags = useMemo(() => [...new Set(PROBLEMS.flatMap((p) => p.tags))].sort(), []);
  const list = PROBLEMS.filter((p) =>
    (diff === 'all' || p.difficulty === diff) &&
    (!tag || p.tags.includes(tag)) &&
    (!q || `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
  );
  const solved = PROBLEMS.filter((p) => progress.problems[p.id]).length;

  return (
    <div className="page">
      <h1>Practice Arena</h1>
      <p className="lead">Coding problems graded by hidden tests — from warm-ups to interview classics. Solved {solved}/{PROBLEMS.length}.</p>
      <div className="filters">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter problems…" aria-label="Filter problems" />
        <div className="seg">
          {DIFFS.map((d) => <button key={d} className={diff === d ? 'on' : ''} onClick={() => setDiff(d)}>{d}</button>)}
        </div>
        <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by topic">
          <option value="">All topics</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="problem-table">
        {list.map((p) => (
          <Link key={p.id} to={`/practice/${p.id}`} className="problem-row">
            <span className="problem-status">{progress.problems[p.id] ? '✅' : '○'}</span>
            <span className="problem-title">{p.title}</span>
            <span className="problem-tags">{p.tags.slice(0, 3).map((t) => <span key={t} className="pill">{t}</span>)}</span>
            <span className={`diff diff-${p.difficulty}`}>{p.difficulty}</span>
          </Link>
        ))}
        {list.length === 0 && <p className="muted">No problems match those filters.</p>}
      </div>
    </div>
  );
}

export function ProblemPage() {
  const { problemId = '' } = useParams();
  const navigate = useNavigate();
  const { progress, update } = useProgress();
  const p = getProblem(problemId);
  const [check, setCheckState] = useState<CheckHandle>({ enabled: false, run: () => false });
  const [state, setState] = useState<'idle' | 'checking' | 'solved' | 'failed'>('idle');
  if (!p) return <div className="page"><h1>Problem not found</h1><Link to="/practice">Back to Practice</Link></div>;
  const track = getTrack(p.track);
  const wasSolved = !!progress.problems[p.id];

  const submit = async () => {
    setState('checking');
    const ok = await check.run();
    if (ok) {
      sfx.correct();
      update((pr) => applyProblemSolved(pr, p.id, p.difficulty));
      setState('solved');
    } else {
      sfx.wrong();
      setState('failed');
    }
  };

  return (
    <div className="page problem-page">
      <div className="problem-head">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/practice')}>← Problems</button>
        <h1>{p.title}</h1>
        <span className={`diff diff-${p.difficulty}`}>{p.difficulty}</span>
        {wasSolved && <span className="pill pill-live">Solved</span>}
      </div>
      {track && <div className="muted small">Builds on: <Link to={`/learn/${track.id}`}>{track.icon} {track.title}</Link> · Topics: {p.tags.join(', ')}</div>}
      <CodeView step={p.step} locked={false} setCheck={setCheckState} />
      <div className="submit-bar">
        {state === 'solved' && <PipSays mood="cheer" size={48}>Accepted! {wasSolved ? '' : `+${PROBLEM_XP[p.difficulty]} XP`}</PipSays>}
        {state === 'failed' && <PipSays mood="sad" size={48}>Some tests failed — check the results above and try again.</PipSays>}
        <button className="btn btn-primary" disabled={!check.enabled || state === 'checking'} onClick={submit}>
          {state === 'checking' ? 'Checking…' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
