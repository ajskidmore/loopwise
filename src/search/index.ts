/**
 * Client-side full-text search over tracks, units, lessons (including step text) and problems.
 * Built once at startup; the whole curriculum is small enough to index in the browser.
 */
import MiniSearch from 'minisearch';
import { TRACKS } from '../content';
import { PROBLEMS } from '../content/problems';
import type { Step } from '../content/types';

export interface SearchDoc {
  id: string;
  type: 'track' | 'unit' | 'lesson' | 'problem';
  title: string;
  subtitle: string;
  tags: string;
  text: string;
  /** Route to open. */
  href: string;
  ready: boolean;
}

function stepText(s: Step): string {
  switch (s.kind) {
    case 'explain': return `${s.title ?? ''} ${s.body}`;
    case 'choice': return `${s.prompt} ${s.choices.join(' ')}`;
    case 'code': return s.prompt;
    default: return s.prompt;
  }
}

function buildDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const t of TRACKS) {
    docs.push({ id: `t:${t.id}`, type: 'track', title: t.title, subtitle: t.tagline, tags: t.category, text: t.description, href: `/learn/${t.id}`, ready: true });
    for (const u of t.units) {
      docs.push({ id: `u:${u.id}`, type: 'unit', title: u.title, subtitle: t.title, tags: '', text: u.summary, href: `/learn/${t.id}#${u.id}`, ready: true });
      for (const l of u.lessons) {
        docs.push({
          id: `l:${l.id}`, type: 'lesson', title: l.title, subtitle: `${t.title} · ${u.title}`, tags: l.tags.join(' '),
          text: `${l.summary} ${(l.steps ?? []).map(stepText).join(' ')}`, href: `/lesson/${l.id}`, ready: l.status === 'ready',
        });
      }
    }
  }
  for (const p of PROBLEMS) {
    docs.push({ id: `p:${p.id}`, type: 'problem', title: p.title, subtitle: `Practice · ${p.difficulty}`, tags: p.tags.join(' '), text: p.step.prompt, href: `/practice/${p.id}`, ready: true });
  }
  return docs;
}

const docs = buildDocs();
const byId = new Map(docs.map((d) => [d.id, d]));
const index = new MiniSearch<SearchDoc>({
  fields: ['title', 'tags', 'subtitle', 'text'],
  storeFields: ['id'],
  searchOptions: { boost: { title: 4, tags: 3, subtitle: 1 }, prefix: true, fuzzy: 0.2 },
});
index.addAll(docs);

export function search(query: string, limit = 30): SearchDoc[] {
  const q = query.trim();
  if (!q) return [];
  // Available content first, then by relevance (sort is stable).
  return index.search(q)
    .map((r) => byId.get(r.id as string)!)
    .filter(Boolean)
    .sort((a, b) => Number(b.ready) - Number(a.ready))
    .slice(0, limit);
}

export function suggest(query: string): string[] {
  return index.autoSuggest(query, { prefix: true, fuzzy: 0.2 }).slice(0, 5).map((s) => s.suggestion);
}
