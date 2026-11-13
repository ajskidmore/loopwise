// Regenerates docs/CURRICULUM.md from src/content/roadmap.ts.  Run: npm run curriculum
import { writeFileSync } from 'node:fs';
import { buildRoadmap } from '../src/content/roadmap.ts';

const tracks = buildRoadmap();
const byId = new Map(tracks.map((t) => [t.id, t]));
let lessons = 0, units = 0;
const out: string[] = [];
for (const [i, t] of tracks.entries()) {
  units += t.units.length;
  out.push(`## ${i + 1}. ${t.icon} ${t.title} \`${t.id}\``);
  out.push('');
  out.push(`${t.description}`);
  out.push('');
  out.push(`*~${t.estimatedHours}h · after: ${t.prerequisites.map((p) => byId.get(p)?.title).join(', ') || 'nothing — start here'}*`);
  out.push('');
  for (const [ui, u] of t.units.entries()) {
    out.push(`**Unit ${ui + 1} — ${u.title}** \`${u.id}\` — ${u.summary}`);
    for (const l of u.lessons) { lessons++; out.push(`- ${l.title} — ${l.summary} \`${l.id}\``); }
    out.push(`- 🏆 Checkpoint test`);
    out.push('');
  }
}
const header = `# Loopwise curriculum\n\n> Generated from \`src/content/roadmap.ts\` by \`npm run curriculum\`. Do not edit by hand.\n> Which lessons are written is tracked in [STATUS.md](STATUS.md).\n\n**${tracks.length} courses · ${units} units · ${lessons} lessons.** Courses are listed in the recommended order; each ends with a final exam.\n\n`;
writeFileSync(new URL('../docs/CURRICULUM.md', import.meta.url), header + out.join('\n'));
console.log(`docs/CURRICULUM.md: ${tracks.length} tracks, ${units} units, ${lessons} lessons`);
