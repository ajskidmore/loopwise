import { Link } from 'react-router-dom';
import { TRACKS, contentStats, getTrack } from '../content';
import type { TrackCategory } from '../content/types';
import { useProgress } from '../progress/ProgressContext';
import { trackCompletion } from '../progress/model';

const CATEGORY_LABEL: Record<TrackCategory, string> = {
  foundations: 'Start here',
  programming: 'Programming',
  math: 'Math for CS',
  'cs-core': 'Core computer science',
  web: 'Web development',
  systems: 'Systems',
  languages: 'More languages',
  advanced: 'Grad-level & beyond',
};
const ORDER: TrackCategory[] = ['foundations', 'programming', 'math', 'cs-core', 'web', 'systems', 'languages', 'advanced'];

export default function Courses() {
  const { progress } = useProgress();
  const s = contentStats();
  return (
    <div className="page">
      <h1>All courses</h1>
      <p className="lead">
        A complete path from <strong>never coded before</strong> to <strong>ready for a computer science master's</strong>.
        {' '}{s.tracks} courses · {s.units} units · {s.lessons} lessons planned ({s.readyLessons} available now, more added regularly).
      </p>
      {ORDER.map((cat) => {
        const tracks = TRACKS.filter((t) => t.category === cat);
        if (!tracks.length) return null;
        return (
          <section key={cat} className="course-group">
            <h2>{CATEGORY_LABEL[cat]}</h2>
            <div className="course-grid">
              {tracks.map((t) => {
                const c = trackCompletion(progress, t.id);
                return (
                  <Link key={t.id} to={`/learn/${t.id}`} className="course-card" style={{ ['--accent' as string]: t.color }}>
                    <div className="course-icon">{t.icon}</div>
                    <div className="course-body">
                      <h3>{t.title}</h3>
                      <p>{t.tagline}</p>
                      <div className="course-meta">
                        <span>{t.units.length} units</span>
                        <span>~{t.estimatedHours}h</span>
                        {c.ready > 0 ? <span className="pill pill-live">{c.ready} lessons live</span> : <span className="pill">Coming soon</span>}
                      </div>
                      {t.prerequisites.length > 0 && (
                        <div className="course-prereq">After: {t.prerequisites.map((p) => getTrack(p)?.title).join(', ')}</div>
                      )}
                      <div className="mini-progress"><div style={{ width: `${(c.done / c.total) * 100}%` }} /></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
