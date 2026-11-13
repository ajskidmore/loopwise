/**
 * Review mode: builds a short session from questions the learner got wrong,
 * topped up with random questions from lessons they've finished (light spaced practice).
 */
import { getLesson, getUnit } from './content';
import type { QuestionStep } from './content/types';
import type { Progress } from './progress/model';

export const lessonKey = (lessonId: string, i: number) => `L:${lessonId}#${i}`;
export const checkpointKey = (unitId: string, i: number) => `C:${unitId}#${i}`;

export function stepForKey(key: string): QuestionStep | null {
  const m = /^([LC]):(.+)#(\d+)$/.exec(key);
  if (!m) return null;
  const [, kind, id, idx] = m;
  const i = Number(idx);
  if (kind === 'L') {
    const s = getLesson(id)?.lesson.steps?.[i];
    return s && s.kind !== 'explain' ? s : null;
  }
  return getUnit(id)?.unit.checkpoint?.questions[i] ?? null;
}

export interface ReviewItem { key: string; step: QuestionStep }

/** Mistakes that still point at real questions (content can change between versions). */
export function validMistakes(p: Progress): string[] {
  return Object.keys(p.mistakes ?? {}).filter((k) => stepForKey(k));
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function buildReview(p: Progress, size = 8): ReviewItem[] {
  const mistakes = validMistakes(p)
    .sort((a, b) => p.mistakes[b] - p.mistakes[a])
    .slice(0, size);
  const items: ReviewItem[] = mistakes.map((key) => ({ key, step: stepForKey(key)! }));
  if (items.length < size) {
    const pool: string[] = [];
    for (const id of Object.keys(p.lessons)) {
      const steps = getLesson(id)?.lesson.steps ?? [];
      steps.forEach((s, i) => {
        const k = lessonKey(id, i);
        // skip long code exercises in top-ups to keep review quick
        if (s.kind !== 'explain' && s.kind !== 'code' && s.kind !== 'terminal' && !mistakes.includes(k)) pool.push(k);
      });
    }
    for (const key of shuffle(pool).slice(0, size - items.length)) items.push({ key, step: stepForKey(key)! });
  }
  return shuffle(items);
}
