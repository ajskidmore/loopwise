/**
 * Pip — Loopwise's original mascot: a round little robot with a loop-shaped antenna.
 * Moods change the face. Pure SVG, scales to any size.
 */
export type PipMood = 'happy' | 'cheer' | 'sad' | 'think' | 'wave';

export function Pip({ size = 96, mood = 'happy', className = '' }: { size?: number; mood?: PipMood; className?: string }) {
  const eyes = {
    happy: (
      <>
        <ellipse cx="44" cy="58" rx="6" ry="8" fill="#1B1340" />
        <ellipse cx="76" cy="58" rx="6" ry="8" fill="#1B1340" />
        <circle cx="46" cy="55" r="2.2" fill="#fff" />
        <circle cx="78" cy="55" r="2.2" fill="#fff" />
      </>
    ),
    wave: (
      <>
        <ellipse cx="44" cy="58" rx="6" ry="8" fill="#1B1340" />
        <ellipse cx="76" cy="58" rx="6" ry="8" fill="#1B1340" />
        <circle cx="46" cy="55" r="2.2" fill="#fff" />
        <circle cx="78" cy="55" r="2.2" fill="#fff" />
      </>
    ),
    cheer: (
      <>
        <path d="M37 60 Q44 50 51 60" stroke="#1B1340" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M69 60 Q76 50 83 60" stroke="#1B1340" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </>
    ),
    sad: (
      <>
        <ellipse cx="44" cy="60" rx="5.5" ry="6.5" fill="#1B1340" />
        <ellipse cx="76" cy="60" rx="5.5" ry="6.5" fill="#1B1340" />
        <path d="M36 49 L50 53" stroke="#1B1340" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M84 49 L70 53" stroke="#1B1340" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
    think: (
      <>
        <ellipse cx="46" cy="57" rx="5.5" ry="7.5" fill="#1B1340" />
        <ellipse cx="78" cy="57" rx="5.5" ry="7.5" fill="#1B1340" />
        <circle cx="48" cy="53" r="2" fill="#fff" />
        <circle cx="80" cy="53" r="2" fill="#fff" />
      </>
    ),
  }[mood];

  const mouth = {
    happy: <path d="M50 74 Q60 83 70 74" stroke="#1B1340" strokeWidth="4" fill="none" strokeLinecap="round" />,
    wave: <path d="M50 74 Q60 83 70 74" stroke="#1B1340" strokeWidth="4" fill="none" strokeLinecap="round" />,
    cheer: <path d="M47 71 Q60 88 73 71 Z" fill="#1B1340" />,
    sad: <path d="M50 80 Q60 72 70 80" stroke="#1B1340" strokeWidth="4" fill="none" strokeLinecap="round" />,
    think: <path d="M54 77 L68 75" stroke="#1B1340" strokeWidth="4" strokeLinecap="round" />,
  }[mood];

  return (
    <svg className={`pip pip-${mood} ${className}`} width={size} height={size} viewBox="0 0 120 130" role="img" aria-label={`Pip the robot looking ${mood}`}>
      {/* antenna loop */}
      <path d="M60 22 L60 12" stroke="#5B3FD9" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 12 C 48 2, 48 -2, 60 6 C 72 -2, 72 2, 60 12" stroke="#FFC83D" strokeWidth="4" fill="none" strokeLinecap="round" className="pip-antenna" />
      {/* arms */}
      {mood === 'cheer' || mood === 'wave' ? (
        <>
          <path d="M14 70 Q4 48 12 36" stroke="#5B3FD9" strokeWidth="8" fill="none" strokeLinecap="round" className={mood === 'wave' ? 'pip-wave' : ''} />
          {mood === 'cheer' && <path d="M106 70 Q116 48 108 36" stroke="#5B3FD9" strokeWidth="8" fill="none" strokeLinecap="round" />}
          {mood === 'wave' && <path d="M106 74 Q116 88 108 98" stroke="#5B3FD9" strokeWidth="8" fill="none" strokeLinecap="round" />}
        </>
      ) : (
        <>
          <path d="M14 74 Q4 88 12 98" stroke="#5B3FD9" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M106 74 Q116 88 108 98" stroke="#5B3FD9" strokeWidth="8" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* body */}
      <rect x="14" y="22" width="92" height="92" rx="40" fill="#7C5CFF" />
      <rect x="14" y="22" width="92" height="92" rx="40" fill="url(#pipShade)" />
      {/* face screen */}
      <rect x="26" y="36" width="68" height="56" rx="26" fill="#E9E4FF" />
      {eyes}
      {mouth}
      {/* cheeks */}
      <ellipse cx="34" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.7" />
      <ellipse cx="86" cy="74" rx="5" ry="3" fill="#FF8FB1" opacity="0.7" />
      {/* feet */}
      <rect x="34" y="110" width="18" height="12" rx="6" fill="#5B3FD9" />
      <rect x="68" y="110" width="18" height="12" rx="6" fill="#5B3FD9" />
      <defs>
        <linearGradient id="pipShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PipSays({ children, mood = 'happy', size = 64 }: { children: React.ReactNode; mood?: PipMood; size?: number }) {
  return (
    <div className="pip-says">
      <Pip size={size} mood={mood} />
      <div className="bubble">{children}</div>
    </div>
  );
}
