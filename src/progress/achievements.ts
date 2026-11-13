/**
 * Achievements are DERIVED from progress (never stored), so they can't get out of sync
 * and adding a new one instantly credits everyone who already qualifies.
 */
import type { Progress } from './model';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: (p: Progress) => boolean;
}

const lessonsDone = (p: Progress) => Object.keys(p.lessons).length;

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', icon: '🌱', title: 'First Steps', description: 'Finish your first lesson', earned: (p) => lessonsDone(p) >= 1 },
  { id: 'perfect', icon: '💯', title: 'Flawless', description: 'Finish a lesson with no mistakes', earned: (p) => Object.values(p.lessons).some((l) => l.bestAccuracy >= 1) },
  { id: 'lessons-10', icon: '📘', title: 'Bookworm', description: 'Finish 10 lessons', earned: (p) => lessonsDone(p) >= 10 },
  { id: 'lessons-25', icon: '📚', title: 'Scholar', description: 'Finish 25 lessons', earned: (p) => lessonsDone(p) >= 25 },
  { id: 'lessons-50', icon: '🎒', title: 'Dedicated', description: 'Finish 50 lessons', earned: (p) => lessonsDone(p) >= 50 },
  { id: 'lessons-100', icon: '🏛️', title: 'Centurion', description: 'Finish 100 lessons', earned: (p) => lessonsDone(p) >= 100 },
  { id: 'checkpoint', icon: '🏆', title: 'Checkpoint!', description: 'Pass your first unit checkpoint', earned: (p) => Object.keys(p.units).length >= 1 },
  { id: 'checkpoints-5', icon: '🥇', title: 'Unstoppable', description: 'Pass 5 checkpoints', earned: (p) => Object.keys(p.units).length >= 5 },
  { id: 'course', icon: '🎓', title: 'Graduate', description: 'Pass a course final exam', earned: (p) => Object.keys(p.tracks).length >= 1 },
  { id: 'courses-3', icon: '🧑‍🎓', title: 'Triple Threat', description: 'Pass 3 course final exams', earned: (p) => Object.keys(p.tracks).length >= 3 },
  { id: 'streak-3', icon: '🔥', title: 'On Fire', description: 'Reach a 3-day streak', earned: (p) => p.streak.best >= 3 },
  { id: 'streak-7', icon: '📅', title: 'Week Warrior', description: 'Reach a 7-day streak', earned: (p) => p.streak.best >= 7 },
  { id: 'streak-30', icon: '🌋', title: 'Habit Formed', description: 'Reach a 30-day streak', earned: (p) => p.streak.best >= 30 },
  { id: 'xp-100', icon: '⚡', title: 'Charged Up', description: 'Earn 100 XP', earned: (p) => p.xp >= 100 },
  { id: 'xp-1000', icon: '🌟', title: 'Superstar', description: 'Earn 1,000 XP', earned: (p) => p.xp >= 1000 },
  { id: 'problem-1', icon: '🧩', title: 'Problem Solver', description: 'Solve a Practice Arena problem', earned: (p) => Object.keys(p.problems).length >= 1 },
  { id: 'problem-10', icon: '🧠', title: 'Puzzle Master', description: 'Solve 10 Practice Arena problems', earned: (p) => Object.keys(p.problems).length >= 10 },
  { id: 'review', icon: '🔁', title: 'Never Forget', description: 'Finish a review session', earned: (p) => (p.reviews ?? 0) >= 1 },
  { id: 'goal', icon: '🎯', title: 'Goal Getter', description: 'Hit your daily XP goal', earned: (p) => Object.values(p.daily).some((xp) => xp >= p.dailyGoal) },
];

/** Achievements earned in `after` that weren't earned in `before`. */
export function newlyEarned(before: Progress, after: Progress): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.earned(before) && a.earned(after));
}
