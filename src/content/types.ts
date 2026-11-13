/**
 * Loopwise content schema.
 *
 * Hierarchy:  Track (a "course")  →  Unit (a "section")  →  Lesson  →  Step
 *
 * - Every Unit ends with a Checkpoint test that must be passed to unlock the next Unit.
 * - Every Track ends with a Final Exam that must be passed to earn the track badge.
 * - Lessons are made of small Steps (one idea or one question per screen).
 *
 * Lessons that exist only as plans have `status: 'planned'` and no steps; the UI
 * shows them as "coming soon" and search still finds them.
 */

import type { ShellGoal, ShellSetup } from '../engine/shell';

export type Language = 'python' | 'javascript' | 'html' | 'sql' | 'java' | 'c' | 'cpp' | 'text';

/** Languages that can run live in the browser today (no server needed). */
export const RUNNABLE_LANGUAGES: Language[] = ['python', 'javascript'];

// ---------------------------------------------------------------- Steps

/** A teaching card. `body` is lightweight markdown (see src/components/Markdown.tsx). */
export interface ExplainStep {
  kind: 'explain';
  title?: string;
  body: string;
  /** Optional "Pip says" tip shown in a speech bubble. */
  tip?: string;
}

/** Multiple choice. `answer` is the index of the correct choice. */
export interface ChoiceStep {
  kind: 'choice';
  prompt: string;
  /** Optional code shown above the choices (e.g. "what does this print?"). */
  code?: string;
  language?: Language;
  choices: string[];
  answer: number;
  explanation: string;
}

/**
 * Fill in the blank(s). Write `___` in `template` for each blank.
 * `answers[i]` lists every accepted answer for blank i (compared ignoring surrounding spaces).
 */
export interface FillStep {
  kind: 'fill';
  prompt: string;
  template: string;
  language?: Language;
  answers: string[][];
  /** Optional word bank shown as tappable chips (Duolingo style). Include distractors. */
  bank?: string[];
  explanation: string;
}

/** Put scrambled lines into the right order (a "Parsons problem"). `lines` is the CORRECT order. */
export interface OrderStep {
  kind: 'order';
  prompt: string;
  lines: string[];
  language?: Language;
  explanation: string;
}

/** Type a short answer (numbers or words). Numeric answers may use a tolerance. */
export interface AnswerStep {
  kind: 'answer';
  prompt: string;
  code?: string;
  language?: Language;
  /** Accepted answers. Compared case-insensitively, whitespace-trimmed. */
  accept: string[];
  /** If set, the answer is parsed as a number and accepted within ± tolerance of accept[0]. */
  numericTolerance?: number;
  explanation: string;
}

export interface CodeTest {
  /** Shown to the learner, e.g. "prints Hello, world!" */
  name: string;
  /**
   * Python/JS code run AFTER the learner's code, in the same scope.
   * Must raise / throw (e.g. `assert ...`) to fail.
   * Special variable available to tests: `__output__` (Python) / `__output__` (JS) = everything printed.
   */
  code: string;
}

/** Write and run real code. */
export interface CodeStep {
  kind: 'code';
  prompt: string;
  language: Language;
  starter: string;
  /** If set, printed output must match exactly (after trimming trailing whitespace). */
  expectedOutput?: string;
  tests?: CodeTest[];
  /**
   * SQL only: statements run on a fresh database BEFORE the learner's code (create tables, insert sample rows).
   * Every run starts from scratch, so learners can't break the data.
   */
  setup?: string;
  hints?: string[];
  /** Reference solution. Shown after 2 failed attempts and used by the automated content tests. */
  solution: string;
  explanation?: string;
}

/**
 * Hands-on practice in a pretend terminal (src/engine/shell.ts). Nothing touches a real computer.
 * The learner types commands; Check passes when every part of `goal` is met.
 */
export interface TerminalStep {
  kind: 'terminal';
  prompt: string;
  /** Starting folders/files and directory. */
  setup?: ShellSetup;
  goal: ShellGoal;
  hints?: string[];
  /** Commands that solve it from the setup — shown after 2 failed checks and verified by tests. */
  solution: string[];
  explanation?: string;
}

export type QuestionStep = ChoiceStep | FillStep | OrderStep | AnswerStep | CodeStep | TerminalStep;
export type Step = ExplainStep | QuestionStep;

// ---------------------------------------------------------------- Structure

export type ContentStatus = 'ready' | 'planned';

export interface Lesson {
  id: string; // globally unique, kebab-case, e.g. "py-1-hello"
  title: string;
  summary: string;
  /** Concepts taught — used for search and the glossary. */
  tags: string[];
  status: ContentStatus;
  steps?: Step[];
}

export interface Checkpoint {
  /** Fraction (0–1) of questions that must be correct. */
  passScore: number;
  /** Mistakes allowed before the attempt ends (the "hearts"). */
  hearts: number;
  questions: QuestionStep[];
}

export interface Unit {
  id: string; // e.g. "py-1"
  title: string;
  summary: string;
  lessons: Lesson[];
  checkpoint?: Checkpoint;
}

export type TrackCategory = 'foundations' | 'programming' | 'math' | 'cs-core' | 'systems' | 'web' | 'advanced' | 'languages';

export interface Track {
  id: string; // e.g. "python-1"
  title: string;
  /** One-sentence pitch shown on the track card. */
  tagline: string;
  description: string;
  category: TrackCategory;
  /** Emoji used as the track icon. */
  icon: string;
  /** Accent color (CSS). */
  color: string;
  /** Primary programming language, if any. */
  language?: Language;
  /** Track ids that should be finished first (soft requirement: shown as "recommended first"). */
  prerequisites: string[];
  /** Rough hours for a beginner. */
  estimatedHours: number;
  units: Unit[];
  finalExam?: Checkpoint;
}

/** A standalone LeetCode-style problem in the Practice arena. */
export interface Problem {
  id: string;
  title: string;
  difficulty: 'intro' | 'easy' | 'medium' | 'hard';
  tags: string[];
  /** Track id this problem reinforces. */
  track: string;
  step: CodeStep;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  /** Lesson id where it's taught. */
  lesson?: string;
}
