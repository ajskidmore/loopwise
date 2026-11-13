/**
 * One view per step kind. Each view reports to the player through `setCheck`:
 *   enabled  – whether the bottom "Check" button is active
 *   run      – grades the current answer; returns true if correct
 * Views lock their inputs when `locked` is true (after checking).
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { AnswerStep, ChoiceStep, CodeStep, ExplainStep, FillStep, OrderStep, Step, TerminalStep } from '../content/types';
import { gradeAnswer, gradeChoice, gradeCode, gradeFill, gradeOrder, gradeTerminal } from '../engine/grading';
import { createShell, displayPath, runLine, type ShellState } from '../engine/shell';
import { canRun, runCode, warmup } from '../engine/runner';
import type { RunResult } from '../engine/types';
import { CodeBlock, Markdown } from '../components/Markdown';
import { PipSays } from '../components/Pip';

const CodeEditor = lazy(() => import('../components/CodeEditor'));

export interface CheckHandle { enabled: boolean; run: () => boolean | Promise<boolean> }
interface ViewProps<S extends Step> { step: S; locked: boolean; setCheck: (c: CheckHandle) => void }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ------------------------------------------------------------------ explain
function ExplainView({ step, setCheck }: ViewProps<ExplainStep>) {
  useEffect(() => setCheck({ enabled: true, run: () => true }), [step, setCheck]);
  return (
    <div className="step step-explain">
      {step.title && <h2>{step.title}</h2>}
      <Markdown text={step.body} />
      {step.tip && <PipSays>{step.tip}</PipSays>}
    </div>
  );
}

// ------------------------------------------------------------------ choice
function ChoiceView({ step, locked, setCheck }: ViewProps<ChoiceStep>) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => setPicked(null), [step]);
  useEffect(() => setCheck({ enabled: picked !== null, run: () => gradeChoice(step, picked!) }), [picked, step, setCheck]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= step.choices.length) setPicked(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, step]);
  return (
    <div className="step">
      <h2 className="prompt"><Markdown text={step.prompt} /></h2>
      {step.code && <CodeBlock code={step.code} language={step.language} />}
      <div className="choices">
        {step.choices.map((c, i) => {
          const cls = ['choice', picked === i && 'picked', locked && i === step.answer && 'is-answer', locked && picked === i && i !== step.answer && 'is-wrong']
            .filter(Boolean).join(' ');
          return (
            <button key={i} className={cls} disabled={locked} onClick={() => setPicked(i)}>
              <span className="choice-key">{i + 1}</span>
              <span className="choice-text">{c}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ fill
function FillView({ step, locked, setCheck }: ViewProps<FillStep>) {
  const parts = useMemo(() => step.template.split('___'), [step]);
  const blanks = parts.length - 1;
  const [values, setValues] = useState<string[]>(() => Array(blanks).fill(''));
  const bank = useMemo(() => (step.bank ? shuffle(step.bank) : null), [step]);
  useEffect(() => setValues(Array(blanks).fill('')), [step, blanks]);
  useEffect(
    () => setCheck({ enabled: values.every((v) => v.trim() !== ''), run: () => gradeFill(step, values) }),
    [values, step, setCheck],
  );
  const placeChip = (chip: string) => {
    const idx = values.findIndex((v) => v === '');
    if (idx >= 0) setValues(values.map((v, i) => (i === idx ? chip : v)));
  };
  return (
    <div className="step">
      <h2 className="prompt"><Markdown text={step.prompt} /></h2>
      <pre className="code-block fill-template">
        <code>
          {parts.map((p, i) => (
            <span key={i}>
              {p}
              {i < blanks && (bank ? (
                <button className={`blank ${values[i] ? 'filled' : ''}`} disabled={locked} onClick={() => setValues(values.map((v, j) => (j === i ? '' : v)))}>
                  {values[i] || '    '}
                </button>
              ) : (
                <input
                  className="blank-input" value={values[i]} disabled={locked} size={Math.max(4, values[i].length + 1)}
                  autoCapitalize="off" autoCorrect="off" spellCheck={false} aria-label={`blank ${i + 1}`}
                  onChange={(e) => setValues(values.map((v, j) => (j === i ? e.target.value : v)))}
                />
              ))}
            </span>
          ))}
        </code>
      </pre>
      {bank && (
        <div className="chips">
          {bank.map((chip, i) => {
            const used = values.filter((v) => v === chip).length >= bank.filter((b) => b === chip).length;
            return <button key={i} className="chip" disabled={locked || used} onClick={() => placeChip(chip)}>{chip}</button>;
          })}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ order
function OrderView({ step, locked, setCheck }: ViewProps<OrderStep>) {
  const pool = useMemo(() => {
    let s = shuffle(step.lines.map((l, i) => ({ l, i })));
    // never start already solved
    if (s.every((x, k) => x.i === k)) s = [...s.slice(1), s[0]];
    return s;
  }, [step]);
  const [chosen, setChosen] = useState<number[]>([]);
  useEffect(() => setChosen([]), [step]);
  useEffect(
    () => setCheck({ enabled: chosen.length === step.lines.length, run: () => gradeOrder(step, chosen.map((k) => pool[k].l)) }),
    [chosen, step, pool, setCheck],
  );
  return (
    <div className="step">
      <h2 className="prompt"><Markdown text={step.prompt} /></h2>
      <div className="order-answer">
        {chosen.length === 0 && <span className="order-placeholder">Tap the lines below in the right order</span>}
        {chosen.map((k, pos) => (
          <button key={k} className="order-line placed" disabled={locked} onClick={() => setChosen(chosen.filter((c) => c !== k))}>
            <span className="order-num">{pos + 1}</span>{pool[k].l}
          </button>
        ))}
      </div>
      <div className="order-pool">
        {pool.map((x, k) => (
          <button key={k} className="order-line" disabled={locked || chosen.includes(k)} onClick={() => setChosen([...chosen, k])}>
            {x.l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ answer
function AnswerView({ step, locked, setCheck }: ViewProps<AnswerStep>) {
  const [value, setValue] = useState('');
  useEffect(() => setValue(''), [step]);
  useEffect(() => setCheck({ enabled: value.trim() !== '', run: () => gradeAnswer(step, value) }), [value, step, setCheck]);
  return (
    <div className="step">
      <h2 className="prompt"><Markdown text={step.prompt} /></h2>
      {step.code && <CodeBlock code={step.code} language={step.language} />}
      <input
        className="answer-input" value={value} disabled={locked} placeholder="Type your answer" autoFocus
        autoCapitalize="off" autoCorrect="off" spellCheck={false} onChange={(e) => setValue(e.target.value)}
        aria-label="Your answer"
      />
    </div>
  );
}

// ------------------------------------------------------------------ code
export function CodeView({ step, locked, setCheck, onAttempt }: ViewProps<CodeStep> & { onAttempt?: (failedCount: number) => void }) {
  const [code, setCode] = useState(step.starter);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [loadingRuntime, setLoadingRuntime] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [fails, setFails] = useState(0);
  const runnable = canRun(step.language);
  // HTML/CSS exercises show a live preview of the learner's page instead of printed output.
  const isHtml = step.language === 'html';
  const [preview, setPreview] = useState(step.starter);

  useEffect(() => {
    if (!isHtml) return;
    const t = setTimeout(() => setPreview(code), 300); // wait for a pause in typing before redrawing
    return () => clearTimeout(t);
  }, [code, isHtml]);

  useEffect(() => {
    setCode(step.starter);
    setPreview(step.starter);
    setResult(null);
    setHintsShown(0);
    setFails(0);
    if (runnable) {
      setLoadingRuntime(true);
      warmup(step.language).catch(() => {}).finally(() => setLoadingRuntime(false));
    }
  }, [step, runnable]);

  const execute = async () => {
    setRunning(true);
    const r = await runCode(step.language, code, step.tests ?? [], '', step.setup ?? '');
    setResult(r);
    setRunning(false);
    return r;
  };

  useEffect(() => {
    setCheck({
      enabled: runnable && !running && code.trim() !== '',
      run: async () => {
        const r = await execute();
        const ok = gradeCode(step, r).passed;
        if (!ok) {
          const f = fails + 1;
          setFails(f);
          onAttempt?.(f);
        }
        return ok;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, running, step, fails, runnable, setCheck]);

  const grade = result ? gradeCode(step, result) : null;

  return (
    <div className="step step-code">
      <div className="prompt"><Markdown text={step.prompt} /></div>
      {!runnable && <div className="notice">Running {step.language} in the browser is coming soon — read the solution below.</div>}
      <Suspense fallback={<pre className="code-block">{code}</pre>}>
        <CodeEditor value={code} onChange={setCode} language={step.language} onRun={execute} readOnly={locked} />
      </Suspense>
      <div className="code-actions">
        <button className="btn btn-secondary btn-sm" onClick={execute} disabled={!runnable || running || locked}>
          {running ? 'Running…' : loadingRuntime ? `Loading ${step.language === 'sql' ? 'SQL' : 'Python'}…` : '▶ Run'}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => { setCode(step.starter); setResult(null); }} disabled={locked}>Reset</button>
        {step.hints && hintsShown < step.hints.length && (
          <button className="btn btn-ghost btn-sm" onClick={() => setHintsShown(hintsShown + 1)}>💡 Hint {hintsShown + 1}/{step.hints.length}</button>
        )}
        {(fails >= 2 || !runnable) && !locked && (
          <button className="btn btn-ghost btn-sm" onClick={() => setCode(step.solution)}>Show solution</button>
        )}
      </div>
      {hintsShown > 0 && (
        <div className="hints">
          {step.hints!.slice(0, hintsShown).map((h, i) => <PipSays key={i} mood="think" size={40}><Markdown text={h} /></PipSays>)}
        </div>
      )}
      {isHtml && (
        <div className="html-preview">
          <div className="output-label">Preview</div>
          {/* sandbox="" = the most locked-down frame: no scripts, forms, popups or access to Loopwise. */}
          <iframe className="preview-frame" title="Preview of your page" sandbox="" srcDoc={preview} />
        </div>
      )}
      {result && (
        <div className="output">
          <div className="output-label">{isHtml ? 'Checks' : 'Output'}</div>
          {!isHtml && <pre className="output-text">{result.output || (result.error ? '' : '(nothing was printed)')}</pre>}
          {result.error && <pre className="output-error">{result.error}</pre>}
          {grade && step.expectedOutput !== undefined && grade.outputMatches === false && (
            <div className="expected">
              <div className="output-label">Expected</div>
              <pre className="output-text">{step.expectedOutput}</pre>
            </div>
          )}
          {result.tests.length > 0 && (
            <ul className="tests">
              {result.tests.map((t, i) => (
                <li key={i} className={t.passed ? 'pass' : 'fail'}>
                  {t.passed ? '✓' : '✗'} {t.name}{!t.passed && t.message ? ` — ${t.message}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


// ------------------------------------------------------------------ terminal
interface TermLine { prompt: string; cmd: string; output: string; error: boolean }

export function TerminalView({ step, locked, setCheck, onAttempt }: ViewProps<TerminalStep> & { onAttempt?: (failedCount: number) => void }) {
  const shell = useRef<ShellState>(createShell(step.setup));
  const [lines, setLines] = useState<TermLine[]>([]);
  const [transcript, setTranscript] = useState('');
  const [input, setInput] = useState('');
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [failures, setFailures] = useState<string[]>([]);
  const [fails, setFails] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    shell.current = createShell(step.setup);
    setLines([]);
    setTranscript('');
    setFailures([]);
    setInput('');
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reset(); setFails(0); setHintsShown(0); setShowSolution(false); }, [step]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [lines]);

  const promptText = () => `learner@loopwise:${displayPath(shell.current.cwd)}$`;

  const submit = () => {
    if (locked) return;
    const cmd = input;
    const prompt = promptText();
    const r = runLine(shell.current, cmd);
    setInput('');
    setHistIdx(null);
    if (r.clear) { setLines([]); return; }
    setLines((ls) => [...ls, { prompt, cmd, output: r.output, error: r.error }]);
    setTranscript((t) => t + r.output);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    const hist = shell.current.history;
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit(); }
    else if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault();
      const i = histIdx === null ? hist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i); setInput(hist[i]);
    } else if (e.key === 'ArrowDown' && histIdx !== null) {
      e.preventDefault();
      const i = histIdx + 1;
      if (i >= hist.length) { setHistIdx(null); setInput(''); } else { setHistIdx(i); setInput(hist[i]); }
    }
  };

  useEffect(() => {
    setCheck({
      enabled: shell.current.history.length > 0,
      run: () => {
        const f = gradeTerminal(step, shell.current, transcript);
        setFailures(f);
        if (f.length) {
          const n = fails + 1;
          setFails(n);
          onAttempt?.(n);
        }
        return f.length === 0;
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, transcript, step, fails, setCheck]);

  return (
    <div className="step step-terminal">
      <div className="prompt"><Markdown text={step.prompt} /></div>
      <div className="terminal" onClick={() => inputRef.current?.focus()} role="group" aria-label="Practice terminal">
        <div className="terminal-bar" aria-hidden="true"><span /><span /><span /><em>practice terminal — nothing here touches your real computer</em></div>
        <div className="terminal-body" role="log" aria-live="polite">
          {lines.length === 0 && <div className="terminal-hint">Type a command and press Enter. Try <code>help</code> to list commands.</div>}
          {lines.map((l, i) => (
            <div key={i}>
              <div><span className="term-prompt">{l.prompt}</span> {l.cmd}</div>
              {l.output && <pre className={l.error ? 'term-err' : 'term-out'}>{l.output.replace(/\n$/, '')}</pre>}
            </div>
          ))}
          {!locked && (
            <div className="term-input-row">
              <label className="term-prompt" htmlFor="term-input">{promptText()}</label>
              <input
                id="term-input" ref={inputRef} className="term-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
                autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} autoFocus
              />
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <div className="code-actions">
        <button className="btn btn-ghost btn-sm" onClick={reset} disabled={locked}>Reset terminal</button>
        {step.hints && hintsShown < step.hints.length && (
          <button className="btn btn-ghost btn-sm" onClick={() => setHintsShown(hintsShown + 1)}>💡 Hint {hintsShown + 1}/{step.hints.length}</button>
        )}
        {fails >= 2 && !showSolution && <button className="btn btn-ghost btn-sm" onClick={() => setShowSolution(true)}>Show solution</button>}
      </div>
      {hintsShown > 0 && (
        <div className="hints">
          {step.hints!.slice(0, hintsShown).map((h, i) => <PipSays key={i} mood="think" size={40}><Markdown text={h} /></PipSays>)}
        </div>
      )}
      {showSolution && (
        <div className="output"><div className="output-label">One way to do it (press Reset terminal, then type these)</div><pre className="output-text">{step.solution.join('\n')}</pre></div>
      )}
      {failures.length > 0 && (
        <ul className="tests">{failures.map((f, i) => <li key={i} className="fail">✗ {f}</li>)}</ul>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ dispatcher
export function StepView(props: ViewProps<Step> & { onAttempt?: (n: number) => void }) {
  const { step } = props;
  switch (step.kind) {
    case 'explain': return <ExplainView {...props} step={step} />;
    case 'choice': return <ChoiceView {...props} step={step} />;
    case 'fill': return <FillView {...props} step={step} />;
    case 'order': return <OrderView {...props} step={step} />;
    case 'answer': return <AnswerView {...props} step={step} />;
    case 'code': return <CodeView {...props} step={step} />;
    case 'terminal': return <TerminalView {...props} step={step} />;
  }
}

/** Short "correct answer" text shown in the feedback sheet after a wrong answer. */
export function correctAnswerText(step: Step): string | null {
  switch (step.kind) {
    case 'choice': return step.choices[step.answer];
    case 'fill': return step.answers.map((a) => a[0]).join(', ');
    case 'order': return step.lines.join('  →  ');
    case 'answer': return step.accept[0];
    case 'terminal': return step.solution.join('   then   ');
    default: return null;
  }
}
