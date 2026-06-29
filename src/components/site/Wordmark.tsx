interface WordmarkProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Wordmark({ className = "", variant = "dark" }: WordmarkProps) {
  const ink = variant === "dark" ? "text-ink" : "text-white";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20 L12 5 L21 20" />
          <path d="M8 20 L12 13 L16 20" />
        </svg>
      </span>
      <span className={`font-serif text-lg font-semibold tracking-tight ${ink}`}>
        Andina<span className="text-brand">.</span>
      </span>
    </span>
  );
}
