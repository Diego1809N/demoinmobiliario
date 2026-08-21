import logoAsset from "@/assets/sj-logo.png.asset.json";

interface WordmarkProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Wordmark({ className = "", variant = "dark" }: WordmarkProps) {
  const ink = variant === "dark" ? "text-ink" : "text-white";
  const sub = variant === "dark" ? "text-muted-foreground" : "text-white/70";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoAsset.url}
        alt="Silvia Jaramillo Negocios Inmobiliarios"
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-base font-semibold tracking-tight ${ink}`}>
          Silvia <span className="text-brand">Jaramillo</span>
        </span>
        <span className={`mt-1 text-[10px] uppercase tracking-[0.18em] ${sub}`}>
          Negocios Inmobiliarios
        </span>
      </span>
    </span>
  );
}
