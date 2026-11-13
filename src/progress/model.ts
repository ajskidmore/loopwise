/**
 * Pure progress model (no React, no Firebase). Saved to localStorage for guests and
 * to Firestore at users/{uid} for signed-in learners. Keep this shape backwards compatible:
 * add fields with defaults in `normalize`, never rename.
 */
import { getTrack } from '../content';

export interface LessonRecord { completedAt: number; bestAccuracy: number; times: number }
export interface TestRecord { passedAt: number; bestScore: number }

export interface Progress {
  version: 1;
  xp: number;
  streak: { count: number; best: number; lastDay: string | null };
  /** YYYY-MM-DD → xp earned that day (last ~90 days). */
  daily: Record<string, number>;
  dailyGoal: number;
  lessons: Record<string, LessonRecord>;
  /** unitId → passed checkpoint */
  units: Record<string, TestRecord>;
  /** trackId → passed final exam */
  tracks: Record<string, TestRecord>;
  /** problemId → solved */
  problems: Record<string, { solvedAt: number }>;
  /**
   * Questions answered wrong, for Review mode. Key → time it was missed.
   * Keys: "L:<lessonId>#<stepIndex>" or "C:<unitId>#<questionIndex>" (see src/review.ts).
   */
  mistakes: Record<string, number>;
  /** Review sessions completed. */
  reviews: number;
  updatedAt: number;
}

export const LESSON_XP = 10;
export const PERFECT_BONUS = 5;
export const CHECKPOINT_XP = 25;
export const PROBLEM_XP = { intro: 10, easy: 15, medium: 25, hard: 40 } as const;
export const REVIEW_XP = 10;
/** Keep at most this many mistakes (oldest dropped). */
const MAX_MISTAKES = 200;

export function emptyProgress(): Progress {
  return {
    version: 1, xp: 0, streak: { count: 0, best: 0, lastDay: null }, daily: {}, dailyGoal: 30,
    lessons: {}, units: {}, tracks: {}, problems: {}, mistakes: {}, reviews: 0, updatedAt: 0,
  };
}

export function normalize(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<Progress>;
  return {
    ...base, ...r,
    streak: { ...base.streak, ...(r.streak ?? {}) },
    daily: r.daily ?? {}, lessons: r.lessons ?? {}, units: r.units ?? {}, tracks: r.tracks ?? {}, problems: r.problems ?? {},
    mistakes: r.mistakes ?? {}, reviews: r.reviews ?? 0,
    version: 1,
  };
}

// ------------------------------------------------------------ dates
export function todayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
function dayDiff(a: string, b: string): number {
  const pa = Date.UTC(+a.slice(0, 4), +a.slice(5, 7) - 1, +a.slice(8, 10));
  const pb = Date.UTC(+b.slice(0, 4), +b.slice(5, 7) - 1, +b.slice(8, 10));
  return Math.round((pb - pa) / 86_400_000);
}

/** Streak as displayed today (0 if a day was missed). */
export function currentStreak(p: Progress, today = todayKey()): number {
  if (!p.streak.lastDay) return 0;
  return dayDiff(p.streak.lastDay, today) <= 1 ? p.streak.count : 0;
}

function addXp(p: Progress, xp: number, day: string): Progress {
  const daily = { ...p.daily, [day]: (p.daily[day] ?? 0) + xp };
  // keep ~90 days
  const keys = Object.keys(daily).sort();
  while (keys.length > 90) delete daily[keys.shift()!];
  let { count, best, lastDay } = p.streak;
  if (lastDay !== day) {
    count = lastDay && dayDiff(lastDay, day) === 1 ? count + 1 : 1;
    lastDay = day;
  }
  best = Math.max(best, count);
  return { ...p, xp: p.xp + xp, daily, streak: { count, best, lastDay }, updatedAt: Date.now() };
}

// ------------------------------------------------------------ events
export function applyLessonResult(p: Progress, r: { lessonId: string; xp: number; accuracy: number; day?: string }): Progress {
  const day = r.day ?? todayKey();
  const prev = p.lessons[r.lessonId];
  const xp = prev ? Math.ceil(r.xp / 2) : r.xp;
  const next = addXp(p, xp, day);
  next.lessons = {
    ...p.lessons,
    [r.lessonId]: { completedAt: prev?.completedAt ?? Date.now(), bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, r.accuracy), times: (prev?.times ?? 0) + 1 },
  };
  return next;
}

export function applyTestResult(p: Progress, kind: 'unit' | 'track', id: string, score: number, passed: boolean): Progress {
  const map = kind === 'unit' ? p.units : p.tracks;
  const prev = map[id];
  let next = p;
  if (passed) next = addXp(p, prev ? Math.ceil(CHECKPOINT_XP / 2) : CHECKPOINT_XP * (kind === 'track' ? 2 : 1), todayKey());
  if (!passed) return next;
  const rec = { passedAt: prev?.passedAt ?? Date.now(), bestScore: Math.max(prev?.bestScore ?? 0, score) };
  return kind === 'unit' ? { ...next, units: { ...p.units, [id]: rec } } : { ...next, tracks: { ...p.tracks, [id]: rec } };
}

export function applyProblemSolved(p: Progress, id: string, difficulty: keyof typeof PROBLEM_XP): Progress {
  if (p.problems[id]) return p;
  const next = addXp(p, PROBLEM_XP[difficulty], todayKey());
  return { ...next, problems: { ...p.problems, [id]: { solvedAt: Date.now() } } };
}

// ------------------------------------------------------------ mistakes & review
/** Record wrong answers (add) and questions now answered right (remove). */
export function updateMistakes(p: Progress, missedKeys: string[], correctKeys: string[] = []): Progress {
  if (!missedKeys.length && !correctKeys.length) return p;
  const mistakes = { ...p.mistakes };
  for (const k of correctKeys) delete mistakes[k];
  const now = Date.now();
  for (const k of missedKeys) mistakes[k] = now;
  const keys = Object.keys(mistakes).sort((a, b) => mistakes[a] - mistakes[b]);
  while (keys.length > MAX_MISTAKES) delete mistakes[keys.shift()!];
  return { ...p, mistakes, updatedAt: now };
}

export function applyReviewResult(p: Progress, missedKeys: string[], correctKeys: string[]): Progress {
  const next = addXp(updateMistakes(p, missedKeys, correctKeys), REVIEW_XP, todayKey());
  return { ...next, reviews: (p.reviews ?? 0) + 1 };
}

// ------------------------------------------------------------ unlocking
export function isUnitComplete(p: Progress, trackId: string, unitIndex: number): boolean {
  const unit = getTrack(trackId)?.units[unitIndex];
  if (!unit) return false;
  if (p.units[unit.id]) return true;
  const ready = unit.lessons.filter((l) => l.status === 'ready');
  return !unit.checkpoint && ready.length > 0 && ready.length === unit.lessons.length && ready.every((l) => p.lessons[l.id]);
}

export function isUnitUnlocked(p: Progress, trackId: string, unitIndex: number): boolean {
  return unitIndex === 0 || isUnitComplete(p, trackId, unitIndex - 1);
}

export function isLessonUnlocked(p: Progress, trackId: string, unitIndex: number, lessonIndex: number): boolean {
  const unit = getTrack(trackId)?.units[unitIndex];
  if (!unit) return false;
  if (p.units[unit.id]) return true;
  if (!isUnitUnlocked(p, trackId, unitIndex)) return false;
  return lessonIndex === 0 || !!p.lessons[unit.lessons[lessonIndex - 1].id];
}

export function trackCompletion(p: Progress, trackId: string): { done: number; total: number; ready: number } {
  const t = getTrack(trackId);
  if (!t) return { done: 0, total: 0, ready: 0 };
  const lessons = t.units.flatMap((u) => u.lessons);
  return {
    done: lessons.filter((l) => p.lessons[l.id]).length,
    total: lessons.length,
    ready: lessons.filter((l) => l.status === 'ready').length,
  };
}

// ------------------------------------------------------------ levels
/** Level n starts at 50·n·(n−1) XP: 0, 100, 300, 600, 1000, … */
export function levelForXp(xp: number): { level: number; into: number; span: number } {
  let level = 1;
  while (50 * (level + 1) * level <= xp) level++;
  const start = 50 * level * (level - 1);
  const end = 50 * (level + 1) * level;
  return { level, into: xp - start, span: end - start };
}

// ------------------------------------------------------------ syncing
/** Merge two progress copies (e.g. guest device + cloud) without losing anything. */
export function mergeProgress(a: Progress, b: Progress): Progress {
  const pickBest = <T extends { bestScore?: number; bestAccuracy?: number }>(x?: T, y?: T): T =>
    !x ? y! : !y ? x : ((x.bestScore ?? x.bestAccuracy ?? 0) >= (y.bestScore ?? y.bestAccuracy ?? 0) ? x : y);
  const mergeMap = <T extends object>(m1: Record<string, T>, m2: Record<string, T>, f: (x?: T, y?: T) => T) => {
    const out: Record<string, T> = {};
    for (const k of new Set([...Object.keys(m1), ...Object.keys(m2)])) out[k] = f(m1[k], m2[k]);
    return out;
  };
  const daily: Record<string, number> = { ...a.daily };
  for (const [k, v] of Object.entries(b.daily)) daily[k] = Math.max(daily[k] ?? 0, v);
  const sa = a.streak, sb = b.streak;
  const streak = !sa.lastDay ? sb : !sb.lastDay ? sa : sa.lastDay > sb.lastDay ? sa : sb.lastDay > sa.lastDay ? sb : sa.count >= sb.count ? sa : sb;
  return {
    version: 1,
    xp: Math.max(a.xp, b.xp),
    streak: { ...streak, best: Math.max(sa.best, sb.best, streak.count) },
    daily,
    dailyGoal: a.updatedAt >= b.updatedAt ? a.dailyGoal : b.dailyGoal,
    lessons: mergeMap(a.lessons, b.lessons, (x, y) => (!x ? y! : !y ? x : { ...pickBest(x, y), times: Math.max(x.times, y.times) })),
    units: mergeMap(a.units, b.units, pickBest),
    tracks: mergeMap(a.tracks, b.tracks, pickBest),
    problems: mergeMap(a.problems, b.problems, (x, y) => x ?? y!),
    // Removals can't be merged reliably, so the most recently updated copy wins.
    mistakes: a.updatedAt >= b.updatedAt ? a.mistakes : b.mistakes,
    reviews: Math.max(a.reviews ?? 0, b.reviews ?? 0),
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
  };
}
