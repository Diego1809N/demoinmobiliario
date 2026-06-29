import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MessageSquare, Star, ShoppingBag, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [total, disp, vend, msgs] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("status", "disponible"),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("status", "vendida"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
      ]);
      return { total: total.count || 0, disp: disp.count || 0, vend: vend.count || 0, msgs: msgs.count || 0 };
    },
  });

  const cards = [
    { label: "Propiedades", value: stats?.total ?? 0, icon: Building2, color: "primary" },
    { label: "Disponibles", value: stats?.disp ?? 0, icon: Star, color: "brand" },
    { label: "Vendidas/Alquiladas", value: stats?.vend ?? 0, icon: ShoppingBag, color: "primary" },
    { label: "Mensajes sin leer", value: stats?.msgs ?? 0, icon: MessageSquare, color: "brand" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Resumen de tu actividad</p>
        </div>
        <Link to="/admin/propiedades/nueva" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">+ Nueva propiedad</Link>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border bg-card p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${c.color === "brand" ? "bg-brand text-brand-foreground" : "bg-primary text-primary-foreground"}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-bold font-serif">{c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/propiedades" className="rounded-2xl border bg-card p-6 flex items-center justify-between hover:shadow-md transition">
          <div><p className="font-semibold">Gestionar propiedades</p><p className="text-sm text-muted-foreground">Crear, editar, archivar</p></div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </Link>
        <Link to="/admin/mensajes" className="rounded-2xl border bg-card p-6 flex items-center justify-between hover:shadow-md transition">
          <div><p className="font-semibold">Ver mensajes</p><p className="text-sm text-muted-foreground">Consultas del público</p></div>
          <ArrowRight className="h-5 w-5 text-primary" />
        </Link>
      </div>
    </div>
  );
}
