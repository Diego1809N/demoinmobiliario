import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { PageHero } from "@/components/site/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Calio & Co" },
      { name: "description", content: "Escribinos para tasaciones, ventas, alquileres o consultas generales en Salta. Te respondemos a la brevedad." },
      { property: "og:title", content: "Contacto — Calio & Co" },
      { property: "og:description", content: "Estamos a un mensaje de distancia. Tasaciones sin cargo." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("contact_messages").insert({
      name: String(fd.get("name") || "").slice(0, 100),
      email: String(fd.get("email") || "").slice(0, 200),
      phone: String(fd.get("phone") || "").slice(0, 50) || null,
      message: String(fd.get("message") || "").slice(0, 2000),
    });
    setSending(false);
    if (error) toast.error("No se pudo enviar"); else { toast.success("Gracias, te contactaremos pronto."); (e.target as HTMLFormElement).reset(); }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageHero
        title="Hablemos"
        description="Completá el formulario y te respondemos a la brevedad, o escribinos directamente por WhatsApp."
      />

      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-16 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="name" required maxLength={100} placeholder="Nombre" className="rounded-lg border px-3 py-2.5 text-sm bg-background" />
            <input name="phone" maxLength={50} placeholder="Teléfono" className="rounded-lg border px-3 py-2.5 text-sm bg-background" />
          </div>
          <input name="email" type="email" required maxLength={200} placeholder="Email" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
          <textarea name="message" required maxLength={2000} rows={6} placeholder="¿En qué podemos ayudarte?" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
          <button disabled={sending} className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white disabled:opacity-60 hover:bg-ink/85 transition">
            {sending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
        <div className="space-y-4">
          <InfoCard icon={<Phone className="h-5 w-5" />} title="WhatsApp / Celular" value="+54 387 555 0123" href="tel:+543875550123" />
          <InfoCard icon={<Phone className="h-5 w-5" />} title="Teléfono fijo" value="+54 387 432 9988" href="tel:+543874329988" />
          <InfoCard icon={<Mail className="h-5 w-5" />} title="Email" value="hola@andinapropiedades.ar" href="mailto:hola@andinapropiedades.ar" />
          <InfoCard icon={<MapPin className="h-5 w-5" />} title="Ubicación" value="Av. Belgrano 842, Salta Capital" />
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function InfoCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-2xl border bg-card p-5 flex items-start gap-4">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
        <p className="mt-1 font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} className="block hover:scale-[1.01] transition">{inner}</a> : inner;
}
