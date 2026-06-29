interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b bg-surface-2/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-ink max-w-3xl leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-base text-muted-foreground">{description}</p>
        )}
      </div>
    </section>
  );
}
