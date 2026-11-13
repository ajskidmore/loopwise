/**
 * CodeMirror 6 editor (syntax highlighting, auto-indent, works on mobile).
 * Lazy-loaded by callers via React.lazy so the main bundle stays small.
 */
import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Prec } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import type { Language } from '../content/types';

interface Props {
  value: string;
  onChange: (v: string) => void;
  language: Language;
  onRun?: () => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, language, onRun, readOnly }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  useEffect(() => {
    const lang = language === 'python' ? [python()] : language === 'javascript' ? [javascript()] : [];
    const dark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        ...lang,
        ...(dark ? [oneDark, Prec.highest(EditorView.theme({
          // Darker than One Dark's default so every syntax color meets 4.5:1 contrast.
          '&': { backgroundColor: '#15171c' },
          '.cm-gutters': { backgroundColor: '#15171c' },
          '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'rgba(255,255,255,0.03)' },
        }, { dark: true }))] : []),
        EditorView.contentAttributes.of({ 'aria-label': `${language === 'javascript' ? 'JavaScript' : 'Python'} code editor` }),
        keymap.of([
          { key: 'Mod-Enter', run: () => { onRunRef.current?.(); return true; } },
          indentWithTab,
        ]),
        EditorState.tabSize.of(4),
        EditorView.editable.of(!readOnly),
        EditorView.updateListener.of((u) => { if (u.docChanged) onChangeRef.current(u.state.doc.toString()); }),
        EditorView.theme({
          '&': { fontSize: '15px', borderRadius: '14px' },
          '.cm-content': { fontFamily: 'var(--mono)', padding: '10px 0' },
          '.cm-gutters': { borderRadius: '14px 0 0 14px' },
        }),
      ],
    });
    view.current = new EditorView({ state, parent: host.current! });
    // Expose the view on the element so automated browser tests can set the code directly.
    (host.current as HTMLDivElement & { cmView?: EditorView }).cmView = view.current;
    return () => view.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly]);

  // External value changes (e.g. "reset" or "show solution")
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  return <div className="code-editor" ref={host} />;
}
