import { Link } from "@tanstack/react-router";
import { Bed, Bath, Maximize2, MapPin } from "lucide-react";
import { formatPrice, operationLabel } from "@/lib/format";

export interface PropertyLite {
  id: string;
  title: string;
  property_type: string;
  operation: string;
  status: string;
  short_description: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  price_usd: number | null;
  price_ars: number | null;
  consult_price: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  total_m2: number | null;
  covered_m2: number | null;
  images: any;
  featured: boolean;
}

export function PropertyCard({ p }: { p: PropertyLite }) {
  const imgs = Array.isArray(p.images) ? (p.images as string[]) : [];
  const cover = imgs[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=70";
  return (
    <Link
      to="/propiedades/$id"
      params={{ id: p.id }}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={cover} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
            {operationLabel[p.operation]}
          </span>
          {p.featured && <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-foreground">Destacada</span>}
        </div>
        {p.status !== "disponible" && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {p.status}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-ink">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {[p.neighborhood, p.city].filter(Boolean).join(", ") || p.address || "—"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {p.bedrooms != null && <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{p.bedrooms} dorm</span>}
          {p.bathrooms != null && <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.bathrooms}</span>}
          {(p.total_m2 || p.covered_m2) && <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{p.total_m2 || p.covered_m2} m²</span>}
        </div>
        <div className="mt-4 flex items-end justify-between">
          <p className="text-lg font-bold text-ink">{formatPrice(p)}</p>
          <span className="text-xs font-semibold text-primary group-hover:underline">Ver detalle →</span>
        </div>
      </div>
    </Link>
  );
}
