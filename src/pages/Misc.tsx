import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { search, suggest } from '../search';
import { TRACKS, contentStats, getTrack } from '../content';
import { useProgress } from '../progress/ProgressContext';
import { currentStreak, levelForXp, todayKey, trackCompletion } from '../progress/model';
import { firebaseEnabled } from '../firebase';
import { Pip, PipSays } from '../components/Pip';
import { isMuted, setMuted } from '../player/sfx';
import { ACHIEVEMENTS } from '../progress/achievements';
import { validMistakes } from '../review';
import { lastTrack, nextLesson } from './Learn';

// ------------------------------------------------------------------ Landing
export function Landing() {
  const { progress } = useProgress();
  const started = Object.keys(progress.lessons).length > 0;
  if (started) return <Navigate to="/learn" replace />;
  const s = contentStats();
  return (
    <div className="landing">
      <header className="landing-top">
        <span className="brand"><Pip size={40} /><span className="brand-name">loopwise</span></span>
        <Link to="/login" className="btn btn-ghost btn-sm">I already have an account</Link>
      </header>
      <section className="hero">
        <Pip size={200} mood="wave" className="hero-pip" />
        <div>
          <h1>Learn to code from zero to computer science master's — for free.</h1>
          <p className="lead">Bite-sized lessons, real code that runs in your browser, and tests that prove you've got it. No experience needed.</p>
          <div className="hero-actions">
            <Link to="/welcome" className="btn btn-primary btn-big">Get started</Link>
            <Link to="/courses" className="btn btn-secondary btn-big">See the curriculum</Link>
          </div>
        </div>
      </section>
      <section className="features">
        <div className="feature"><span>🧠</span><h3>Starts at zero</h3><p>Never written code? Never taken advanced math? Perfect. Every idea is explained before you use it.</p></div>
        <div className="feature"><span>▶️</span><h3>Real code, real tests</h3><p>Write Python and JavaScript right in the browser. Your code is checked by automatic tests.</p></div>
        <div className="feature"><span>🏆</span><h3>Prove it</h3><p>Every unit ends with a checkpoint test. Pass to unlock what's next.</p></div>
        <div className="feature"><span>🎓</span><h3>Grad-school ready</h3><p>{s.tracks} courses: programming, data structures, algorithms, discrete math, systems, ML and more.</p></div>
      </section>
    </div>
  );
}

// ------------------------------------------------------------------ Search
const TYPE_ICON = { track: '📚', unit: '📦', lesson: '📖', problem: '🧩' } as const;

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const [input, setInput] = useState(q);
  const results = search(q);
  const sugg = q && results.length === 0 ? suggest(q) : [];
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  };
  return (
    <div className="page">
      <h1>Search</h1>
      <form onSubmit={onSubmit} className="search-form" role="search">
        <input autoFocus value={input} onChange={(e) => { setInput(e.target.value); setParams(e.target.value.trim() ? { q: e.target.value } : {}, { replace: true }); }}
          placeholder="Try “loops”, “binary”, “recursion”, “two sum”…" aria-label="Search" />
      </form>
      {!q && (
        <div className="search-suggest">
          <span className="muted">Popular:</span>
          {['print', 'variables', 'binary', 'algorithm', 'modulo', 'recursion', 'big o', 'two sum'].map((s) => (
            <button key={s} className="chip" onClick={() => { setInput(s); setParams({ q: s }); }}>{s}</button>
          ))}
        </div>
      )}
      {q && <p className="muted">{results.length} result{results.length === 1 ? '' : 's'} for “{q}”</p>}
      {sugg.length > 0 && (
        <p>Did you mean {sugg.map((s, i) => <span key={s}>{i > 0 && ', '}<button className="link" onClick={() => { setInput(s); setParams({ q: s }); }}>{s}</button></span>)}?</p>
      )}
      <div className="search-results">
        {results.map((r) => (
          <Link key={r.id} to={r.href} className={`search-result ${r.ready ? '' : 'is-planned'}`}>
            <span className="sr-icon">{TYPE_ICON[r.type]}</span>
            <span className="sr-body">
              <span className="sr-title">{r.title} {!r.ready && <span className="pill">coming soon</span>}</span>
              <span className="sr-sub">{r.subtitle}</span>
            </span>
            <span className="sr-type">{r.type}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ Profile
export function Profile() {
  const { progress, update, user, signOut, resetProgress, syncing } = useProgress();
  const navigate = useNavigate();
  const [muted, setMutedState] = useState(isMuted());
  const [confirmReset, setConfirmReset] = useState(false);
  const { level, into, span } = levelForXp(progress.xp);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const k = todayKey(d);
    return { k, label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2), xp: progress.daily[k] ?? 0 };
  });
  const maxXp = Math.max(progress.dailyGoal, ...days.map((d) => d.xp));
  const started = TRACKS.filter((t) => trackCompletion(progress, t.id).done > 0);
  const track = getTrack(lastTrack());
  const next = track ? nextLesson(progress, track) : null;

  return (
    <div className="page profile">
      <div className="profile-head">
        <Pip size={96} mood="happy" />
        <div>
          <h1>{user?.displayName || user?.email || 'Guest learner'}</h1>
          <div className="muted">{user ? (syncing ? 'Syncing…' : 'Progress saved to your account') : 'Progress saved on this device only'}</div>
          {!user && firebaseEnabled && <Link to="/login" className="btn btn-primary btn-sm">Create a free account to save progress</Link>}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="big">🔥 {currentStreak(progress)}</div><div className="muted small">Day streak (best {progress.streak.best})</div></div>
        <div className="stat-card"><div className="big">⚡ {progress.xp}</div><div className="muted small">Total XP</div></div>
        <div className="stat-card"><div className="big">⭐ {level}</div><div className="muted small">Level · {into}/{span} to next</div></div>
        <div className="stat-card"><div className="big">📖 {Object.keys(progress.lessons).length}</div><div className="muted small">Lessons done</div></div>
        <div className="stat-card"><div className="big">🏆 {Object.keys(progress.units).length}</div><div className="muted small">Checkpoints passed</div></div>
        <div className="stat-card"><div className="big">🧩 {Object.keys(progress.problems).length}</div><div className="muted small">Problems solved</div></div>
      </div>

      {validMistakes(progress).length > 0 && (
        <div className="review-card">
          <span style={{ fontSize: '2rem' }}>🔁</span>
          <div className="grow"><strong>{validMistakes(progress).length} question{validMistakes(progress).length === 1 ? '' : 's'} to review</strong><div className="muted small">Practice the ones you missed until they stick.</div></div>
          <Link to="/review" className="btn btn-primary btn-sm">Review</Link>
        </div>
      )}

      <section className="card">
        <h2>Achievements <span className="muted small">{ACHIEVEMENTS.filter((a) => a.earned(progress)).length}/{ACHIEVEMENTS.length}</span></h2>
        <div className="badge-grid">
          {ACHIEVEMENTS.map((a) => {
            const got = a.earned(progress);
            return (
              <div key={a.id} className={`badge ${got ? 'earned' : 'locked'}`} title={a.description}>
                <span className="badge-icon" aria-hidden="true">{a.icon}</span>
                <div className="badge-title">{a.title}</div>
                <div className="badge-desc">{a.description}</div>
                <span className="sr-only">{got ? 'Earned' : 'Not earned yet'}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>This week</h2>
        <div className="week-chart" role="img" aria-label="XP earned on each of the last 7 days">
          {days.map((d) => (
            <div key={d.k} className="week-col">
              <div className="week-bar-wrap">
                <div className={`week-bar ${d.xp >= progress.dailyGoal ? 'met' : ''}`} style={{ height: `${(d.xp / maxXp) * 100}%` }} title={`${d.xp} XP`} />
                <div className="week-goal" style={{ bottom: `${(progress.dailyGoal / maxXp) * 100}%` }} />
              </div>
              <div className="small muted">{d.label}</div>
              <div className="small">{d.xp}</div>
            </div>
          ))}
        </div>
        {next && <PipSays size={44}>Next up: <Link to={`/lesson/${next.id}`}>{next.title}</Link></PipSays>}
      </section>

      {started.length > 0 && (
        <section className="card">
          <h2>Courses in progress</h2>
          {started.map((t) => {
            const c = trackCompletion(progress, t.id);
            return (
              <Link key={t.id} to={`/learn/${t.id}`} className="course-progress-row">
                <span>{t.icon} {t.title}</span>
                <div className="mini-progress"><div style={{ width: `${(c.done / c.total) * 100}%`, background: t.color }} /></div>
                <span className="small muted">{c.done}/{c.total}</span>
              </Link>
            );
          })}
        </section>
      )}

      <section className="card settings">
        <h2>Settings</h2>
        <label className="setting">
          <span>Daily goal</span>
          <select value={progress.dailyGoal} onChange={(e) => update((p) => ({ ...p, dailyGoal: Number(e.target.value), updatedAt: Date.now() }))}>
            <option value={10}>Casual · 10 XP</option>
            <option value={30}>Regular · 30 XP</option>
            <option value={60}>Serious · 60 XP</option>
            <option value={100}>Intense · 100 XP</option>
          </select>
        </label>
        <label className="setting">
          <span>Sound effects</span>
          <input type="checkbox" checked={!muted} onChange={(e) => { setMuted(!e.target.checked); setMutedState(!e.target.checked); }} />
        </label>
        <div className="setting-actions">
          {user && <button className="btn btn-secondary btn-sm" onClick={async () => { await signOut(); navigate('/'); }}>Sign out</button>}
          {!confirmReset ? (
            <button className="btn btn-ghost btn-sm danger-text" onClick={() => setConfirmReset(true)}>Reset all progress…</button>
          ) : (
            <span className="confirm-inline">Erase everything? <button className="btn btn-danger btn-sm" onClick={() => { resetProgress(); setConfirmReset(false); }}>Yes, reset</button> <button className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>Cancel</button></span>
          )}
        </div>
      </section>
    </div>
  );
}

// ------------------------------------------------------------------ Login
export function Login() {
  const { user, signInGoogle, signInEmail, signUpEmail, resetPassword } = useProgress();
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();
  const [mode, setMode] = useState<'in' | 'up'>('up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/profile" replace />;

  const wrap = async (fn: () => Promise<void>) => {
    setError('');
    setBusy(true);
    try {
      await fn();
      navigate('/learn');
    } catch (e) {
      const msg = (e as Error).message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim();
      setError(msg || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page auth-page">
      <Pip size={110} mood="wave" />
      <h1>{mode === 'up' ? 'Create your free account' : 'Welcome back'}</h1>
      <p className="muted">Save your progress and pick up on any device. Anything you did as a guest is kept.</p>
      {!firebaseEnabled ? (
        <div className="notice">Accounts aren't configured on this copy of Loopwise yet (missing Firebase settings). You can still learn — progress is saved in this browser.</div>
      ) : (
        <>
          <button className="btn btn-secondary btn-wide" disabled={busy} onClick={() => wrap(signInGoogle)}>Continue with Google</button>
          <div className="or">or</div>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); wrap(() => (mode === 'up' ? signUpEmail(name, email, password) : signInEmail(email, password))); }}>
            {mode === 'up' && <input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <input type="password" placeholder="Password (6+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} />
            {error && <div className="form-error" role="alert">{error}</div>}
            {notice && <div className="notice" role="status">{notice}</div>}
            <button className="btn btn-primary btn-wide" disabled={busy}>{busy ? '…' : mode === 'up' ? 'Create account' : 'Sign in'}</button>
          </form>
          {mode === 'in' && (
            <button className="link" onClick={async () => {
              setError(''); setNotice('');
              if (!email) { setError('Type your email above first, then tap "Forgot password?" again.'); return; }
              try { await resetPassword(email); setNotice('Check your email for a link to reset your password.'); }
              catch (e) { setError((e as Error).message.replace('Firebase: ', '')); }
            }}>Forgot password?</button>
          )}
          <button className="link" onClick={() => { setMode(mode === 'up' ? 'in' : 'up'); setError(''); setNotice(''); }}>
            {mode === 'up' ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </>
      )}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="results">
      <Pip size={110} mood="sad" />
      <h1>Page not found</h1>
      <Link to="/learn" className="btn btn-primary">Go to my path</Link>
    </div>
  );
}
