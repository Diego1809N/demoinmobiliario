import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { PageHero } from "@/components/site/PageHero";
import { Award, Users, Target, Sparkles } from "lucide-react";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros — Andina Propiedades" },
      { name: "description", content: "Conocé el equipo detrás de Andina Propiedades, inmobiliaria con sede en Salta capital." },
      { property: "og:title", content: "Sobre Andina Propiedades" },
      { property: "og:description", content: "Experiencia, transparencia y compromiso con cada cliente en el NOA." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageHero
        eyebrow="Sobre nosotros"
        title="Inmobiliaria salteña, mirada local."
        description="Trabajamos junto a familias e inversores para concretar operaciones en Salta capital y el interior, con asesoramiento profesional de punta a punta."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid gap-12 lg:grid-cols-2 items-center">
        <img
          src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=70"
          alt="Equipo de Andina Propiedades"
          className="rounded-3xl object-cover w-full h-full max-h-[520px]"
        />
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium">Nuestra historia</h2>
          <p className="mt-4 text-muted-foreground">
            Andina Propiedades nació para profesionalizar el mercado inmobiliario en el NOA, con un servicio cercano, transparente y orientado a resultados. Hoy somos referentes en Salta por la confianza de cientos de familias e inversores.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: <Award className="h-5 w-5" />, t: "Experiencia", d: "15+ años en el rubro" },
              { icon: <Users className="h-5 w-5" />, t: "Equipo", d: "Asesores matriculados" },
              { icon: <Target className="h-5 w-5" />, t: "Resultados", d: "97% de satisfacción" },
              { icon: <Sparkles className="h-5 w-5" />, t: "Innovación", d: "Tour 360 y marketing digital" },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border bg-card p-5">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">{v.icon}</div>
                <p className="mt-3 font-semibold">{v.t}</p>
                <p className="text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  ),
});
