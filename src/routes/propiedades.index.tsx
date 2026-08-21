import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { PageHero } from "@/components/site/PageHero";
import { PropertyCard, type PropertyLite } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";

type Currency = "USD" | "ARS";
type Search = {
  operation?: "venta" | "alquiler" | "temporario";
  type?: string;
  q?: string;
  min?: number;
  max?: number;
  currency?: Currency;
  beds?: number;
};

export const Route = createFileRoute("/propiedades/")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const s: Search = {};
    const op = raw.operation;
    if (op === "venta" || op === "alquiler" || op === "temporario") s.operation = op;
    if (typeof raw.type === "string" && raw.type) s.type = raw.type;
    if (typeof raw.q === "string" && raw.q) s.q = raw.q;
    if (raw.currency === "USD" || raw.currency === "ARS") s.currency = raw.currency;
    const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? n : undefined; };
    const min = num(raw.min); if (min !== undefined) s.min = min;
    const max = num(raw.max); if (max !== undefined) s.max = max;
    const beds = num(raw.beds); if (beds !== undefined) s.beds = beds;
    return s;
  },
  head: () => ({
    meta: [
      { title: "Propiedades — Silvia Jaramillo Negocios Inmobiliarios" },
      { name: "description", content: "Explorá casas, departamentos, terrenos y locales en venta y alquiler en Salta." },
      { property: "og:title", content: "Propiedades en Salta — Silvia Jaramillo" },
      { property: "og:description", content: "Filtrá por operación, tipo, ubicación y precio." },
    ],
  }),
  component: PropertiesPage,
});

const types = ["Casa", "Departamento", "PH", "Finca", "Terreno", "Local comercial", "Oficina", "Cochera"];

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const currency: Currency = search.currency ?? "USD";
  const priceCol = currency === "ARS" ? "price_ars" : "price_usd";

  const { data, isLoading } = useQuery({
    queryKey: ["properties", search],
    queryFn: async () => {
      let q = supabase.from("properties").select("*").neq("status", "archivada").order("featured", { ascending: false }).order("published_at", { ascending: false });
      if (search.operation) q = q.eq("operation", search.operation);
      if (search.type) q = q.eq("property_type", search.type);
      if (search.beds) q = q.gte("bedrooms", search.beds);
      if (search.min) q = q.gte(priceCol, search.min);
      if (search.max) q = q.lte(priceCol, search.max);
      if (search.q) {
        const term = `%${search.q}%`;
        q = q.or(`title.ilike.${term},neighborhood.ilike.${term},city.ilike.${term},address.ilike.${term}`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as PropertyLite[];
    },
  });

  const set = (patch: Record<string, any>) =>
    navigate({ to: "/propiedades", search: ((prev: any) => ({ ...prev, ...patch })) as any });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageHero
        eyebrow="Catálogo"
        title="Propiedades disponibles"
        description="Encontrá el inmueble ideal con nuestros filtros avanzados."
      />


      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 -mt-8">
        <div className="rounded-2xl border bg-card p-4 shadow-xl grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
          <select value={search.operation ?? ""} onChange={(e) => set({ operation: e.target.value || undefined })} className="rounded-xl border px-3 py-2.5 text-sm bg-background">
            <option value="">Operación</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
            <option value="temporario">Temporario</option>
          </select>
          <select value={search.type ?? ""} onChange={(e) => set({ type: e.target.value || undefined })} className="rounded-xl border px-3 py-2.5 text-sm bg-background">
            <option value="">Tipo</option>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <input defaultValue={search.q ?? ""} onBlur={(e) => set({ q: e.target.value || undefined })} placeholder="Ubicación" className="rounded-xl border px-3 py-2.5 text-sm bg-background" />
          <select value={currency} onChange={(e) => set({ currency: e.target.value as Currency })} className="rounded-xl border px-3 py-2.5 text-sm bg-background">
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
          </select>
          <input type="number" defaultValue={search.min ?? ""} onWheel={(e) => (e.target as HTMLInputElement).blur()} onBlur={(e) => set({ min: e.target.value ? Number(e.target.value) : undefined })} placeholder={`${currency} mín.`} className="rounded-xl border px-3 py-2.5 text-sm bg-background" key={`min-${currency}`} />
          <input type="number" defaultValue={search.max ?? ""} onWheel={(e) => (e.target as HTMLInputElement).blur()} onBlur={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })} placeholder={`${currency} máx.`} className="rounded-xl border px-3 py-2.5 text-sm bg-background" key={`max-${currency}`} />
          <select value={search.beds ?? ""} onChange={(e) => set({ beds: e.target.value ? Number(e.target.value) : undefined })} className="rounded-xl border px-3 py-2.5 text-sm bg-background">
            <option value="">Dormitorios</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
      </div>

      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-12 flex-1">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : data && data.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">{data.length} {data.length === 1 ? "propiedad" : "propiedades"} encontradas</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed bg-surface-2 p-12 text-center">
            <p className="font-semibold text-ink">No encontramos propiedades</p>
            <p className="mt-1 text-sm text-muted-foreground">Probá ajustar los filtros o contactanos para una búsqueda personalizada.</p>
          </div>
        )}
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
