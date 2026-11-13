/**
 * Tiny, safe markdown renderer for lesson text (no HTML injection — everything is React text).
 * Supports: paragraphs, - lists, ``` code blocks ```, | tables |, **bold**, *italic*, `code`.
 */
import { Fragment, type ReactNode } from 'react';

function inline(text: string, keyBase = ''): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith('`')) out.push(<code key={k} className="inline-code">{tok.slice(1, -1)}</code>);
    else if (tok.startsWith('**')) out.push(<strong key={k}>{inline(tok.slice(2, -2), k)}</strong>);
    else out.push(<em key={k}>{inline(tok.slice(1, -1), k)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <pre className="code-block" data-lang={language}>
      {language && language !== 'text' && <span className="code-lang">{language}</span>}
      <code>{code}</code>
    </pre>
  );
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++;
      blocks.push(<CodeBlock key={key++} code={body.join('\n')} language={lang || undefined} />);
    } else if (/^\s*- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) items.push(lines[i++].replace(/^\s*- /, ''));
      blocks.push(<ul key={key++}>{items.map((it, j) => <li key={j}>{inline(it, `li${j}`)}</li>)}</ul>);
    } else if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div className="table-wrap" key={key++}>
          <table>
            <thead><tr>{head.map((c, j) => <th key={j}>{inline(c, `th${j}`)}</th>)}</tr></thead>
            <tbody>{body.map((r, ri) => <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, `td${ri}${j}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
    } else if (line.trim() === '') {
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('```') && !/^\s*- /.test(lines[i]) && !lines[i].startsWith('|')) para.push(lines[i++]);
      blocks.push(<p key={key++}>{para.map((p, j) => <Fragment key={j}>{j > 0 && <br />}{inline(p, `p${j}`)}</Fragment>)}</p>);
    }
  }
  return <div className="md">{blocks}</div>;
}
