/**
 * Pure grading functions for every question type. No React, no DOM — unit-tested in tests/.
 */
import type { AnswerStep, ChoiceStep, CodeStep, FillStep, OrderStep, TerminalStep } from '../content/types';
import { checkGoal, type ShellState } from './shell';
import type { RunResult } from './types';

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();

export function gradeChoice(step: ChoiceStep, picked: number): boolean {
  return picked === step.answer;
}

/** Blanks compare exactly on code (case-sensitive) but ignore surrounding/collapsed whitespace. */
export function gradeFill(step: FillStep, values: string[]): boolean {
  if (values.length !== step.answers.length) return false;
  return step.answers.every((accepted, i) => {
    const v = (values[i] ?? '').trim().replace(/\s+/g, ' ');
    return accepted.some((a) => a.trim().replace(/\s+/g, ' ') === v);
  });
}

export function gradeOrder(step: OrderStep, ordered: string[]): boolean {
  return ordered.length === step.lines.length && ordered.every((l, i) => l === step.lines[i]);
}

export function gradeAnswer(step: AnswerStep, value: string): boolean {
  const v = norm(value);
  if (!v) return false;
  if (step.numericTolerance !== undefined) {
    const n = Number(v.replace(/,/g, ''));
    const target = Number(step.accept[0]);
    return Number.isFinite(n) && Math.abs(n - target) <= step.numericTolerance;
  }
  return step.accept.some((a) => {
    const target = norm(a);
    if (v === target) return true;
    // numeric equivalence: "7.0" == "7", " -5 " == "-5"
    const nv = Number(v);
    const nt = Number(target);
    return v !== '' && Number.isFinite(nv) && Number.isFinite(nt) && nv === nt;
  });
}

/** Trailing whitespace on each line and trailing blank lines are ignored. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

export interface CodeGrade {
  passed: boolean;
  outputMatches: boolean | null;
  failures: string[];
}

export function gradeCode(step: CodeStep, run: RunResult): CodeGrade {
  const failures: string[] = [];
  if (run.timedOut) failures.push('Your code took too long (is there a loop that never ends?)');
  else if (run.error) failures.push('Your code raised an error — see the output.');
  let outputMatches: boolean | null = null;
  if (step.expectedOutput !== undefined && !run.error) {
    outputMatches = normalizeOutput(run.output) === normalizeOutput(step.expectedOutput);
    if (!outputMatches) failures.push('The output doesn\'t match what was expected.');
  }
  for (const t of run.tests) if (!t.passed) failures.push(`${t.name}: ${t.message ?? 'failed'}`);
  return { passed: failures.length === 0, outputMatches, failures };
}

/** Returns the list of unmet goals (empty = passed). */
export function gradeTerminal(step: TerminalStep, state: ShellState, transcript: string): string[] {
  return checkGoal(state, step.goal, transcript);
}
