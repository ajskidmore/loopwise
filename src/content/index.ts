/**
 * Content registry: merges the roadmap (structure) with written lesson content.
 * Add new content modules to CONTENT_MODULES below.
 */
import { buildRoadmap } from './roadmap';
import type { Checkpoint, Lesson, Step, Track, Unit } from './types';
import * as foundations from './lessons/foundations';
import * as foundations2 from './lessons/foundations-2';
import * as math0 from './lessons/math-0';
import * as math0b from './lessons/math-0b';
import * as python1 from './lessons/python-1';
import * as python1b from './lessons/python-1b';
import * as python1c from './lessons/python-1c';
import * as python1d from './lessons/python-1d';
import * as tools from './lessons/tools';
import * as python2a from './lessons/python-2a';
import * as python2b from './lessons/python-2b';
import * as discreteA from './lessons/discrete-a';
import * as discreteB from './lessons/discrete-b';
import * as dsA from './lessons/ds-a';
import * as dsB from './lessons/ds-b';
import * as alA from './lessons/al-a';
import * as alB from './lessons/al-b';
import * as probStats from './lessons/prob-stats';
import * as linearAlgebra from './lessons/linear-algebra';
import * as calculus from './lessons/calculus';
import * as javascript from './lessons/javascript';
import * as web1 from './lessons/web-1';
import * as sql from './lessons/sql';
import * as theory from './lessons/theory';
import * as softwareEngineering from './lessons/software-engineering';
import * as mlIntro from './lessons/ml-intro';
import * as gradReady from './lessons/grad-ready';

export interface ContentModule {
  /** lessonId → steps */
  lessons: Record<string, Step[]>;
  /** unitId → checkpoint test */
  checkpoints?: Record<string, Checkpoint>;
  /** trackId → final exam */
  finalExams?: Record<string, Checkpoint>;
}

export const CONTENT_MODULES: ContentModule[] = [foundations, foundations2, math0, math0b, python1, python1b, python1c, python1d, tools, python2a, python2b, discreteA, discreteB, dsA, dsB, alA, alB, probStats, linearAlgebra, calculus, javascript, web1, sql, theory, softwareEngineering, mlIntro, gradReady];

function build(): Track[] {
  const tracks = buildRoadmap();
  const lessons: Record<string, Step[]> = {};
  const checkpoints: Record<string, Checkpoint> = {};
  const finals: Record<string, Checkpoint> = {};
  for (const m of CONTENT_MODULES) {
    Object.assign(lessons, m.lessons);
    Object.assign(checkpoints, m.checkpoints ?? {});
    Object.assign(finals, m.finalExams ?? {});
  }
  for (const t of tracks) {
    for (const unit of t.units) {
      for (const l of unit.lessons) {
        if (lessons[l.id]) {
          l.steps = lessons[l.id];
          l.status = 'ready';
        }
      }
      if (checkpoints[unit.id]) unit.checkpoint = checkpoints[unit.id];
    }
    if (finals[t.id]) t.finalExam = finals[t.id];
  }
  return tracks;
}

export const TRACKS: Track[] = build();

/** Recommended order for the main learning path. */
export const PATH_ORDER = TRACKS.map((t) => t.id);

// ------------------------------------------------------------ lookups
const lessonIndex = new Map<string, { lesson: Lesson; unit: Unit; track: Track; index: number }>();
const unitIndex = new Map<string, { unit: Unit; track: Track; index: number }>();
for (const track of TRACKS) {
  track.units.forEach((unit, ui) => {
    unitIndex.set(unit.id, { unit, track, index: ui });
    unit.lessons.forEach((lesson, li) => lessonIndex.set(lesson.id, { lesson, unit, track, index: li }));
  });
}

export const getTrack = (id: string) => TRACKS.find((t) => t.id === id);
export const getLesson = (id: string) => lessonIndex.get(id);
export const getUnit = (id: string) => unitIndex.get(id);
export const allLessons = () => [...lessonIndex.values()];

export function contentStats() {
  const lessons = allLessons();
  const ready = lessons.filter((l) => l.lesson.status === 'ready').length;
  const units = [...unitIndex.values()];
  return {
    tracks: TRACKS.length,
    units: units.length,
    lessons: lessons.length,
    readyLessons: ready,
    checkpoints: units.filter((u) => u.unit.checkpoint).length,
  };
}
