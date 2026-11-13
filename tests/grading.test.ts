import { describe, expect, it } from 'vitest';
import { gradeAnswer, gradeFill, normalizeOutput } from '../src/engine/grading';
import { runJs } from '../src/engine/jsHarness';
import { applyLessonResult, applyReviewResult, emptyProgress, isUnitUnlocked, levelForXp, mergeProgress, normalize, todayKey, updateMistakes } from '../src/progress/model';
import { newlyEarned } from '../src/progress/achievements';
import { buildReview, stepForKey } from '../src/review';

describe('grading', () => {
  it('answers accept numeric equivalents and ignore case/space', () => {
    const s = { kind: 'answer' as const, prompt: '', accept: ['7'], explanation: '' };
    expect(gradeAnswer(s, ' 7 ')).toBe(true);
    expect(gradeAnswer(s, '7.0')).toBe(true);
    expect(gradeAnswer(s, '8')).toBe(false);
    expect(gradeAnswer(s, '')).toBe(false);
  });
  it('fill compares blanks exactly but trims', () => {
    const s = { kind: 'fill' as const, prompt: '', template: '___', answers: [['print']], explanation: '' };
    expect(gradeFill(s, [' print '])).toBe(true);
    expect(gradeFill(s, ['Print'])).toBe(false);
  });
  it('normalizes output', () => {
    expect(normalizeOutput('a  \nb\n\n')).toBe('a\nb');
  });
});

describe('js harness', () => {
  it('captures output and runs tests in scope', () => {
    const r = runJs('const x = 2; console.log(x * 3);', [{ name: 'x is 2', code: 'assert(x === 2)' }, { name: 'output', code: 'assert(__output__ === "6\\n")' }]);
    expect(r.error).toBeNull();
    expect(r.output).toBe('6\n');
    expect(r.tests.every((t) => t.passed)).toBe(true);
  });
  it('reports errors', () => {
    expect(runJs('nope()').error).toMatch(/ReferenceError/);
  });
});

describe('progress model', () => {
  it('awards xp and builds a streak across consecutive days', () => {
    let p = emptyProgress();
    p = applyLessonResult(p, { lessonId: 'a', xp: 10, accuracy: 1, day: '2026-01-01' });
    p = applyLessonResult(p, { lessonId: 'b', xp: 10, accuracy: 1, day: '2026-01-02' });
    expect(p.xp).toBe(20);
    expect(p.streak.count).toBe(2);
    p = applyLessonResult(p, { lessonId: 'c', xp: 10, accuracy: 1, day: '2026-01-05' });
    expect(p.streak.count).toBe(1);
    expect(p.streak.best).toBe(2);
  });
  it('replaying a lesson gives reduced xp', () => {
    let p = emptyProgress();
    p = applyLessonResult(p, { lessonId: 'a', xp: 10, accuracy: 1, day: todayKey() });
    p = applyLessonResult(p, { lessonId: 'a', xp: 10, accuracy: 1, day: todayKey() });
    expect(p.xp).toBe(15);
  });
  it('first unit is always unlocked', () => {
    expect(isUnitUnlocked(emptyProgress(), 'python-1', 0)).toBe(true);
    expect(isUnitUnlocked(emptyProgress(), 'python-1', 1)).toBe(false);
  });
  it('levels grow with xp', () => {
    expect(levelForXp(0).level).toBe(1);
    expect(levelForXp(1000).level).toBeGreaterThan(3);
  });
});

describe('review & achievements', () => {
  it('records and clears mistakes', () => {
    let p = updateMistakes(emptyProgress(), ['L:fnd-1-what-is-code#2'], []);
    expect(Object.keys(p.mistakes)).toEqual(['L:fnd-1-what-is-code#2']);
    p = applyReviewResult(p, [], ['L:fnd-1-what-is-code#2']);
    expect(p.mistakes).toEqual({});
    expect(p.reviews).toBe(1);
    expect(p.xp).toBe(10);
  });
  it('maps keys back to real questions and ignores stale keys', () => {
    expect(stepForKey('L:fnd-1-what-is-code#2')?.kind).toBe('choice');
    expect(stepForKey('L:fnd-1-what-is-code#0')).toBeNull(); // explain step
    expect(stepForKey('L:nope#1')).toBeNull();
    expect(stepForKey('C:fnd-1#0')?.kind).toBe('choice');
  });
  it('builds a review session from mistakes plus finished lessons', () => {
    let p = applyLessonResult(emptyProgress(), { lessonId: 'fnd-1-what-is-code', xp: 10, accuracy: 1 });
    p = updateMistakes(p, ['L:fnd-1-what-is-code#2', 'L:gone#9'], []);
    const items = buildReview(p, 4);
    expect(items.some((i) => i.key === 'L:fnd-1-what-is-code#2')).toBe(true);
    expect(items.every((i) => i.step.kind !== 'explain')).toBe(true);
    expect(items.length).toBeLessThanOrEqual(4);
  });
  it('old saved progress without new fields still loads', () => {
    const old = { version: 1, xp: 50, streak: { count: 1, best: 1, lastDay: '2026-01-01' }, daily: {}, dailyGoal: 30, lessons: {}, units: {}, tracks: {}, problems: {}, updatedAt: 1 };
    const p = normalize(old);
    expect(p.mistakes).toEqual({});
    expect(p.reviews).toBe(0);
    expect(mergeProgress(p, emptyProgress()).xp).toBe(50);
  });
  it('reports newly earned achievements once', () => {
    const before = emptyProgress();
    const after = applyLessonResult(before, { lessonId: 'fnd-1-what-is-code', xp: 15, accuracy: 1 });
    const ids = newlyEarned(before, after).map((a) => a.id);
    expect(ids).toContain('first-lesson');
    expect(ids).toContain('perfect');
    expect(newlyEarned(after, after)).toEqual([]);
  });
});
