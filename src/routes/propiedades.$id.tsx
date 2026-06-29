import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { PropertyMap } from "@/components/site/PropertyMap";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, operationLabel, statusLabel } from "@/lib/format";
import { Bed, Bath, Maximize2, Car, Waves, Building2, MapPin, ChevronLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/propiedades/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de propiedad — Calio & Co" },
      { name: "description", content: "Información completa de la propiedad: fotos, características, ubicación y precio." },
    ],
  }),
  component: PropertyDetail,
  errorComponent: ({ error }) => <div className="p-10 text-center">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Propiedad no encontrada.</div>,
});

function PropertyDetail() {
  const { id } = Route.useParams();
  const [idx, setIdx] = useState(0);
  const [sending, setSending] = useState(false);

  const { data: p, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen grid place-items-center">Cargando…</div>;
  if (!p) return null;

  const imgs = (Array.isArray(p.images) ? (p.images as string[]) : []);
  const cover = imgs[idx] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=70";

  const submitContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name") || "").slice(0, 100),
      email: String(fd.get("email") || "").slice(0, 200),
      phone: String(fd.get("phone") || "").slice(0, 50) || null,
      message: String(fd.get("message") || "").slice(0, 2000),
      property_id: p.id,
    });
    setSending(false);
    if (error) toast.error("No se pudo enviar el mensaje");
    else { toast.success("Mensaje enviado. Te contactaremos a la brevedad."); (e.target as HTMLFormElement).reset(); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <Link to="/propiedades" className="text-sm text-muted-foreground hover:text-primary">← Volver al listado</Link>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[16/10]">
              <img src={cover} alt={p.title} className="h-full w-full object-cover" />
              {imgs.length > 1 && (
                <>
                  <button onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)} className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={() => setIdx((idx + 1) % imgs.length)} className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow"><ChevronRight className="h-5 w-5" /></button>
                </>
              )}
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">{operationLabel[p.operation]}</span>
                <span className="rounded-full bg-ink/80 text-white px-3 py-1 text-xs font-semibold">{statusLabel[p.status]}</span>
              </div>
            </div>
            {imgs.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {imgs.slice(0, 10).map((src, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`aspect-[4/3] overflow-hidden rounded-lg border-2 ${i === idx ? "border-primary" : "border-transparent"}`}>
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-brand font-semibold">{p.property_type}</p>
              <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-ink">{p.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{[p.address, p.neighborhood, p.city].filter(Boolean).join(", ")}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {p.bedrooms != null && <Chip icon={<Bed className="h-4 w-4" />} label={`${p.bedrooms} dormitorio${p.bedrooms === 1 ? "" : "s"}`} />}
                {p.bathrooms != null && <Chip icon={<Bath className="h-4 w-4" />} label={`${p.bathrooms} baños`} />}
                {p.covered_m2 != null && <Chip icon={<Maximize2 className="h-4 w-4" />} label={`${p.covered_m2} m² cubiertos`} />}
                {p.total_m2 != null && <Chip icon={<Maximize2 className="h-4 w-4" />} label={`${p.total_m2} m² totales`} />}
                {p.has_garage && <Chip icon={<Car className="h-4 w-4" />} label="Cochera" />}
                {p.has_pool && <Chip icon={<Waves className="h-4 w-4" />} label="Pileta" />}
                {p.has_balcony && <Chip icon={<Building2 className="h-4 w-4" />} label="Balcón" />}
              </div>

              {p.short_description && <p className="mt-6 text-base text-ink/80">{p.short_description}</p>}
              {p.long_description && (
                <div className="mt-4 prose prose-sm max-w-none whitespace-pre-line text-ink/80">{p.long_description}</div>
              )}

              {p.video_url && (
                <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black">
                  <iframe src={toEmbed(p.video_url)} className="h-full w-full" allowFullScreen title="Video" />
                </div>
              )}

              {p.latitude != null && p.longitude != null && (
                <div className="mt-8">
                  <h2 className="font-serif text-2xl font-bold mb-3">Ubicación</h2>
                  <PropertyMap lat={Number(p.latitude)} lng={Number(p.longitude)} title={p.title} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <p className={`font-serif font-bold ${p.consult_price ? "text-3xl text-brand" : "text-4xl text-ink"}`}>{formatPrice(p)}</p>
              <form onSubmit={submitContact} className="mt-6 space-y-3">
                <p className="text-sm font-semibold">Consultá por esta propiedad</p>
                <input name="name" required maxLength={100} placeholder="Nombre" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
                <input name="email" required type="email" maxLength={200} placeholder="Email" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
                <input name="phone" maxLength={50} placeholder="Teléfono (opcional)" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
                <textarea name="message" required maxLength={2000} rows={4} placeholder="Mensaje" defaultValue={`Hola, me interesa la propiedad "${p.title}".`} className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
                <button disabled={sending} className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground disabled:opacity-60">
                  {sending ? "Enviando..." : "Enviar consulta"}
                </button>
              </form>
              <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
                <a href="tel:+543875550123" className="inline-flex items-center gap-2 hover:text-ink"><Phone className="h-4 w-4 text-brand" /> +54 387 555 0123</a>
                <a href="mailto:hola@andinapropiedades.ar" className="inline-flex items-center gap-2 hover:text-ink"><Mail className="h-4 w-4 text-brand" /> hola@andinapropiedades.ar</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
      <WhatsAppButton message={`Hola! Me interesa la propiedad "${p.title}"`} />
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3 py-1.5 text-xs font-medium text-ink">{icon}{label}</span>;
}

function toEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
    return url;
  } catch { return url; }
}
