import logoAsset from "@/assets/calio-logo.png.asset.json";

interface WordmarkProps {
  className?: string;
  variant?: "dark" | "light";
}

export function Wordmark({ className = "", variant = "dark" }: WordmarkProps) {
  const ink = variant === "dark" ? "text-ink" : "text-white";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={logoAsset.url}
        alt="Silvia Jaramillo Negocios Inmobiliarios"
        className="h-9 w-9 object-contain"
      />
      <span className={`font-serif text-lg font-semibold tracking-tight ${ink}`}>
        Calio <span className="text-brand">&</span> Co
      </span>
    </span>
  );
}
