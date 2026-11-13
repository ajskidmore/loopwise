/** Lightweight CSS confetti burst (no library). Hidden for users who prefer reduced motion. */
const COLORS = ['#7c5cff', '#ffc83d', '#2bb673', '#ff5a5f', '#3d8bff', '#ff8a3d'];

export function Confetti({ pieces = 40 }: { pieces?: number }) {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 97) % 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${(i % 10) * 0.08}s`,
            animationDuration: `${1.6 + (i % 5) * 0.25}s`,
            transform: `rotate(${i * 37}deg)`,
          }}
        />
      ))}
    </div>
  );
}
