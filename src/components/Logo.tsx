// src/components/Logo.tsx
interface LogoProps {
  className?: string;
  iconSize?: number;
}

export default function Logo({ className = "", iconSize = 32 }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <path
          d="M6 10 C6 8 8 6 12 6 L18 6 L18 32 L12 32 C8 32 6 30 6 28 Z"
          fill="var(--brand-action)"
        />
        <path
          d="M34 10 C34 8 32 6 28 6 L22 6 L22 32 L28 32 C32 32 34 30 34 28 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M20 4 L22 9 L27 9 L23 12 L24.5 17 L20 14 L15.5 17 L17 12 L13 9 L18 9 Z"
          fill="var(--brand-action)"
        />
      </svg>
      <span className="font-bold text-2xl tracking-tight">Lexera</span>
    </span>
  );
}
