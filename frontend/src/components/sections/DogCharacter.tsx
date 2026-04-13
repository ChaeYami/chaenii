"use client";

export default function DogCharacter() {
  return (
    <div className="relative inline-block" style={{ width: 160, height: 160 }}>
      <svg
        viewBox="0 0 160 160"
        width="160"
        height="160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="80" cy="105" rx="35" ry="28" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* Head */}
        <circle cx="80" cy="62" r="28" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* Left ear */}
        <ellipse cx="58" cy="40" rx="10" ry="16" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" transform="rotate(-15 58 40)" />

        {/* Right ear */}
        <ellipse cx="102" cy="40" rx="10" ry="16" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" transform="rotate(15 102 40)" />

        {/* Eyes */}
        <circle cx="70" cy="58" r="3.5" fill="var(--color-lavender)" />
        <circle cx="90" cy="58" r="3.5" fill="var(--color-lavender)" />
        <circle cx="71" cy="57" r="1.2" fill="var(--color-text-primary)" />
        <circle cx="91" cy="57" r="1.2" fill="var(--color-text-primary)" />

        {/* Nose */}
        <ellipse cx="80" cy="68" rx="3" ry="2.5" fill="var(--color-pink)" />

        {/* Mouth */}
        <path d="M76 72 Q80 76 84 72" stroke="var(--color-border)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Front legs */}
        <rect x="67" y="125" width="8" height="16" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
        <rect x="85" y="125" width="8" height="16" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />

        {/* Tail */}
        <g className="animate-wag" style={{ transformOrigin: "115px 95px" }}>
          <path
            d="M115 95 Q130 80 135 88"
            stroke="var(--color-lavender)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>

      <style jsx>{`
        @keyframes wag {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .animate-wag {
          animation: wag 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
