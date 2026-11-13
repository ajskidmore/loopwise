import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Suspense, useState, type FormEvent } from 'react';
import { useProgress } from '../progress/ProgressContext';
import { currentStreak, levelForXp, todayKey } from '../progress/model';
import { Pip } from './Pip';

const NAV = [
  { to: '/learn', label: 'Learn', icon: '🏠' },
  { to: '/courses', label: 'Courses', icon: '📚' },
  { to: '/practice', label: 'Practice', icon: '🧩' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export function StatsBar() {
  const { progress } = useProgress();
  const streak = currentStreak(progress);
  const { level } = levelForXp(progress.xp);
  const today = progress.daily[todayKey()] ?? 0;
  const goalPct = Math.min(100, Math.round((today / progress.dailyGoal) * 100));
  return (
    <div className="stats-bar">
      <span className={`stat ${streak ? 'stat-fire' : 'stat-dim'}`} title="Day streak">🔥 {streak}</span>
      <span className="stat stat-xp" title="Total XP">⚡ {progress.xp}</span>
      <span className="stat stat-level" title="Level">⭐ {level}</span>
      <span className="stat stat-goal" title={`Daily goal: ${today}/${progress.dailyGoal} XP`}>
        <span className="goal-ring" style={{ ['--pct' as string]: `${goalPct}%` }} />
        {today}/{progress.dailyGoal}
      </span>
    </div>
  );
}

export function Layout() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/learn" className="brand">
          <Pip size={40} />
          <span className="brand-name">loopwise</span>
        </NavLink>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className="nav-item">
              <span className="nav-icon">{n.icon}</span>
              <span className="nav-label">{n.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-col">
        <header className="topbar">
          <NavLink to="/learn" className="brand brand-mobile"><Pip size={32} /><span className="brand-name">loopwise</span></NavLink>
          <form className="top-search" onSubmit={onSearch} role="search">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons, topics, problems…" aria-label="Search" />
          </form>
          <StatsBar />
        </header>
        <main className="content">
          <Suspense fallback={<div className="loading-screen" role="status" aria-label="Loading"><Pip size={64} mood="think" className="bounce" /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <nav className="bottom-nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className="bottom-item">
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
