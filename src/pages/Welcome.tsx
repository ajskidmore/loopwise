/**
 * First-run onboarding: pick a daily goal and a starting point, Duolingo-style.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pip, PipSays } from '../components/Pip';
import { useProgress } from '../progress/ProgressContext';

const GOALS = [
  { xp: 10, label: 'Casual', note: 'About 1 lesson a day' },
  { xp: 30, label: 'Regular', note: 'About 3 lessons a day' },
  { xp: 60, label: 'Serious', note: 'About 6 lessons a day' },
  { xp: 100, label: 'Intense', note: 'Fast track to grad school' },
];

const STARTS = [
  { to: '/lesson/fnd-1-what-is-code', icon: '🌱', label: 'I\'m brand new to coding', note: 'Start with How Computers Think' },
  { to: '/learn/python-1', icon: '🐍', label: 'I know a little — let\'s code', note: 'Jump to Python Basics (you can test out of units)' },
  { to: '/learn/math-0', icon: '🔢', label: 'I want to brush up on math', note: 'Start the Math Refresher' },
  { to: '/courses', icon: '🗺️', label: 'Show me everything', note: 'Browse all courses' },
];

export default function Welcome() {
  const navigate = useNavigate();
  const { progress, update } = useProgress();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(progress.dailyGoal);

  if (step === 0) {
    return (
      <div className="welcome">
        <Pip size={150} mood="wave" />
        <h1>Hi, I'm Pip!</h1>
        <p className="lead">I'll help you go from zero to computer-science-master's ready, a few minutes at a time. Two quick questions first.</p>
        <button className="btn btn-primary btn-big btn-wide" onClick={() => setStep(1)} autoFocus>Let's go</button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="welcome">
        <PipSays mood="think" size={70}>How much do you want to learn each day?</PipSays>
        <div className="welcome-options" role="radiogroup" aria-label="Daily goal">
          {GOALS.map((g) => (
            <button key={g.xp} role="radio" aria-checked={goal === g.xp} className={`choice ${goal === g.xp ? 'picked' : ''}`} onClick={() => setGoal(g.xp)}>
              <span className="choice-text">{g.label} · {g.xp} XP / day<small>{g.note}</small></span>
            </button>
          ))}
        </div>
        <p className="muted small">You can change this anytime in your profile. Consistency beats intensity!</p>
        <button
          className="btn btn-primary btn-wide"
          onClick={() => { update((p) => ({ ...p, dailyGoal: goal, updatedAt: Date.now() })); setStep(2); }}
        >Continue</button>
      </div>
    );
  }

  return (
    <div className="welcome">
      <PipSays mood="happy" size={70}>Where would you like to start?</PipSays>
      <div className="welcome-options">
        {STARTS.map((s) => (
          <button key={s.to} className="choice" onClick={() => navigate(s.to)}>
            <span className="choice-key" aria-hidden="true">{s.icon}</span>
            <span className="choice-text">{s.label}<small>{s.note}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}
