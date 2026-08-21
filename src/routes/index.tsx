import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { PropertyCard, type PropertyLite } from "@/components/site/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Search, ArrowUpRight, MapPin, Bed, Bath, Maximize2, DollarSign,
  Phone, Mail, Star, ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Silvia Jaramillo Negocios Inmobiliarios — Inmobiliaria en Salta" },
      { name: "description", content: "Compra, venta y alquiler de propiedades en Salta. Casas, departamentos, terrenos y locales en el NOA argentino." },
      { property: "og:title", content: "Silvia Jaramillo Negocios Inmobiliarios" },
      { property: "og:description", content: "Propiedades seleccionadas en General Güemes y alrededores." },
    ],
  }),
  component: Home,
});

const HERO_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=75";

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("featured", true)
        .neq("status", "archivada")
        .order("published_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data || []) as unknown as PropertyLite[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* HERO */}
      <section className="px-4 sm:px-6 pt-4">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ink">
          <img
            src={HERO_IMAGE}
            alt="Casa moderna en Salta"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 p-6 sm:p-10 lg:p-14 min-h-[520px]">
            <div className="flex flex-col justify-end text-white animate-fade-in">
              <p className="inline-flex items-center gap-2 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/90">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Inmobiliaria · Salta, Argentina
              </p>
              <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.02]">
                Comprá, alquilá<br />y vendé tu propiedad.
              </h1>
              <p className="mt-5 max-w-md text-base text-white/80">
                Casas, departamentos y terrenos en General Güemes, Salta, Cerrillos, San Lorenzo y los Valles Calchaquíes.
              </p>
              <div className="mt-7">
                <Link to="/propiedades" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white/90">
                  Explorar propiedades <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Floating search card */}
            <SearchCard />
          </div>
        </div>
      </section>

      {/* TRUST BAND */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-ink leading-tight">
              +320 familias<br />confiaron en nosotros.
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
                ].map((u) => (
                  <img key={u} src={u} alt="" className="h-9 w-9 rounded-full ring-2 ring-background object-cover" />
                ))}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white ring-2 ring-background">+99</span>
              </div>
              <div className="text-sm">
                <p className="flex items-center gap-1 font-semibold text-ink">
                  <Star className="h-3.5 w-3.5 fill-brand text-brand" /> 4.9
                </p>
                <p className="text-muted-foreground text-xs">Calificación promedio</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:pt-3">
            <p className="text-muted-foreground text-base leading-relaxed">
              Tu inmobiliaria de confianza en Salta. Te acompañamos durante toda la operación: desde la búsqueda y la tasación hasta la firma de escritura, con asesoramiento legal y financiero.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/propiedades" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/85 transition">
                Ver propiedades <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/contacto" className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink hover:border-ink transition">
                Solicitar tasación <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR LISTINGS */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-ink">Propiedades destacadas</h2>
            <p className="mt-2 text-sm text-muted-foreground">Selección curada de nuestro catálogo en Salta y alrededores.</p>
          </div>
          <Link to="/propiedades" className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:border-ink transition">
            Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {featured && featured.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        ) : (
          <FallbackListings />
        )}
      </section>

      {/* POPULAR CITIES */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-ink">Zonas más buscadas</h2>
            <p className="mt-2 text-sm text-muted-foreground">Explorá las zonas con mayor demanda en la provincia.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((c) => (
            <Link key={c.name} to="/propiedades" className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={c.img} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-serif text-xl font-medium">{c.name}</p>
                <p className="mt-1 text-xs text-white/80">{c.count} propiedades</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 pb-24">
        <div className="rounded-3xl bg-ink p-10 sm:p-14 text-white grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand">Hablemos</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-medium leading-tight">
              ¿Querés vender o tasar tu propiedad en Salta?
            </h2>
            <p className="mt-4 max-w-lg text-white/75 text-sm sm:text-base">
              Te respondemos en menos de 24 hs hábiles con un informe inicial sin cargo y una estrategia de comercialización.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/contacto" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white hover:bg-brand/90 transition">
              Solicitar tasación <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href="tel:+543875550123" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition">
              <Phone className="h-4 w-4" /> +54 387 555 0123
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const CITIES = [
  { name: "General Güemes", count: 124, img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=900&q=70" },
  { name: "San Lorenzo", count: 38, img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=70" },
  { name: "Cerrillos", count: 27, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=70" },
  { name: "Cafayate", count: 19, img: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=900&q=70" },
];

function SearchCard() {
  return (
    <form
      action="/propiedades"
      method="get"
      className="relative self-start lg:justify-self-end w-full lg:max-w-sm rounded-2xl bg-white p-5 sm:p-6 shadow-2xl animate-fade-in"
    >
      <p className="font-serif text-xl font-medium text-ink">Encontrá tu propiedad ideal</p>
      <p className="mt-1 text-xs text-muted-foreground">Filtrá por zona, tipo y precio.</p>

      <div className="mt-5 space-y-3">
        <Field label="Ubicación">
          <select name="q" className="w-full bg-transparent text-sm text-ink outline-none">
            <option value="">Todas las zonas</option>
            <option>General Güemes</option>
            <option>San Lorenzo</option>
            <option>Cerrillos</option>
            <option>Cafayate</option>
          </select>
        </Field>
        <Field label="Tipo de propiedad">
          <select name="type" className="w-full bg-transparent text-sm text-ink outline-none">
            <option value="">Todas</option>
            <option>Casa</option>
            <option>Departamento</option>
            <option>Terreno</option>
            <option>Local comercial</option>
          </select>
        </Field>
        <Field label="Operación">
          <select name="operation" className="w-full bg-transparent text-sm text-ink outline-none">
            <option value="">Cualquiera</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
            <option value="temporario">Temporario</option>
          </select>
        </Field>
      </div>

      <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90">
        <Search className="h-4 w-4" /> Buscar
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-xl border border-border bg-surface-2/50 px-3.5 py-2.5">
      <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function FallbackListings() {
  const demo = [
    { name: "Casa moderna en Tres Cerritos", price: "USD 285.000", loc: "Tres Cerritos, General Güemes", beds: 3, baths: 2, m2: 220, img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=70" },
    { name: "Departamento Centro Histórico", price: "USD 98.000", loc: "Centro, General Güemes", beds: 2, baths: 1, m2: 78, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=70" },
    { name: "Quinta en San Lorenzo", price: "USD 320.000", loc: "San Lorenzo", beds: 4, baths: 3, m2: 480, img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=70" },
    { name: "Terreno en Cerrillos", price: "USD 42.000", loc: "Cerrillos", beds: 0, baths: 0, m2: 800, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=70" },
    { name: "Loft en Cafayate", price: "USD 115.000", loc: "Cafayate", beds: 1, baths: 1, m2: 65, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=70" },
    { name: "Casa con galería, Vaqueros", price: "USD 195.000", loc: "Vaqueros", beds: 3, baths: 2, m2: 180, img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=70" },
  ];
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {demo.map((p) => (
        <article key={p.name} className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink">
              {p.price}
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-serif text-lg font-medium text-ink line-clamp-1">{p.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {p.loc}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
              {p.beds > 0 && <span className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5" />{p.beds} dorm</span>}
              {p.baths > 0 && <span className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{p.baths} baños</span>}
              <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{p.m2} m²</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
