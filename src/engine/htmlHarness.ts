/**
 * HTML/CSS exercises: render the learner's page, then run the lesson's checks against it.
 *
 * How it stays safe:
 * - The learner's HTML goes into an <iframe sandbox="allow-same-origin"> with NO "allow-scripts".
 *   That means <script> tags and onclick="..." attributes in their page never run, and forms/popups/
 *   top-level navigation are blocked. "allow-same-origin" only lets OUR code read the rendered page.
 * - The checks are written by us (in the lesson files), never by the learner.
 *
 * A check is a small piece of JavaScript (a CodeTest) that can use these helpers:
 *   $(sel)            first element matching a CSS selector, or null
 *   $$(sel)           array of every matching element
 *   text(sel)         trimmed text of the first match ('' if none)
 *   attr(sel, name)   an attribute of the first match (null if none)
 *   css(sel, prop)    the browser's computed style value, e.g. css('h1', 'display') → 'block'
 *   px(sel, prop)     a computed length as a number, e.g. px('p', 'padding-top') → 16
 *   color(value)      any CSS color ('red', '#f00', 'rgb(255 0 0)') in the browser's own format, for comparing
 *   assert(cond, msg) fail the check with a friendly message
 *   __source__        the learner's HTML as text
 */
import type { CodeTest } from '../content/types';
import type { RunResult, TestResult } from './types';

/** Width of the hidden page used for grading (wide enough that "desktop" media queries apply). */
export const GRADING_WIDTH = 800;

/** Run every check against an already-rendered document. */
export function checkPage(doc: Document, source: string, tests: CodeTest[]): TestResult[] {
  const win = doc.defaultView!;
  const $ = (sel: string): Element | null => doc.querySelector(sel);
  const $$ = (sel: string): Element[] => Array.from(doc.querySelectorAll(sel));
  const text = (sel: string): string => ($(sel)?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const attr = (sel: string, name: string): string | null => $(sel)?.getAttribute(name) ?? null;
  const css = (sel: string, prop: string): string => {
    const el = $(sel);
    return el ? win.getComputedStyle(el).getPropertyValue(prop).trim() : '';
  };
  const px = (sel: string, prop: string): number => parseFloat(css(sel, prop)) || 0;
  const color = (value: string): string => {
    // Let the browser normalize the color by applying it to a throwaway element.
    const probe = doc.createElement('span');
    probe.style.color = value;
    (doc.body ?? doc.documentElement).appendChild(probe);
    const out = win.getComputedStyle(probe).color;
    probe.remove();
    return out;
  };
  const assert = (cond: unknown, msg?: string) => {
    if (!cond) throw new Error(msg || 'Check failed');
  };

  return tests.map((t) => {
    try {
      const fn = new Function('$', '$$', 'text', 'attr', 'css', 'px', 'color', 'assert', '__source__', t.code);
      fn($, $$, text, attr, css, px, color, assert, source);
      return { name: t.name, passed: true };
    } catch (e) {
      return { name: t.name, passed: false, message: (e as Error).message };
    }
  });
}

/** Render `code` in a hidden sandboxed frame, run the checks, and clean up. Browser only. */
export function runHtml(code: string, tests: CodeTest[]): Promise<RunResult> {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin'); // no allow-scripts: the learner's page can't run code
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    frame.style.cssText = `position:fixed;left:-10000px;top:0;width:${GRADING_WIDTH}px;height:600px;border:0;visibility:hidden;`;
    let finished = false;
    const finish = (r: RunResult) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      frame.remove();
      resolve(r);
    };
    const timer = setTimeout(() => finish({ output: '', error: 'Your page took too long to load.', tests: [] }), 5000);
    frame.onload = () => {
      const doc = frame.contentDocument;
      if (!doc) return finish({ output: '', error: 'Could not read your page.', tests: [] });
      finish({ output: '', error: null, tests: checkPage(doc, code, tests) });
    };
    frame.srcdoc = code;
    document.body.appendChild(frame);
  });
}
