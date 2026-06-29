import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { operationLabel, statusLabel, formatPrice } from "@/lib/format";
import { Edit, Trash2, Archive, ArchiveRestore, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/propiedades/")({
  component: AdminProps,
});

type OpFilter = "todas" | "venta" | "alquiler" | "temporario";

function AdminProps() {
  const qc = useQueryClient();
  const [op, setOp] = useState<OpFilter>("todas");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "properties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = (data || []).filter((p: any) => op === "todas" || p.operation === op);

  const archive = async (id: string) => {
    const { error } = await supabase.from("properties").update({ status: "archivada" }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Archivada"); qc.invalidateQueries({ queryKey: ["admin", "properties"] }); }
  };
  const unarchive = async (id: string) => {
    const { error } = await supabase.from("properties").update({ status: "disponible" }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Desarchivada"); qc.invalidateQueries({ queryKey: ["admin", "properties"] }); }
  };
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar propiedad? Esta acción no se puede deshacer.")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminada"); qc.invalidateQueries({ queryKey: ["admin", "properties"] }); }
  };
  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("properties").update({ featured: !current }).eq("id", id);
    if (error) toast.error(error.message); else qc.invalidateQueries({ queryKey: ["admin", "properties"] });
  };

  const tabs: { v: OpFilter; label: string }[] = [
    { v: "todas", label: "Todas" },
    { v: "venta", label: "Venta" },
    { v: "alquiler", label: "Alquiler" },
    { v: "temporario", label: "Temporario" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold">Propiedades</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} de {data?.length ?? 0}</p>
        </div>
        <Link to="/admin/propiedades/nueva" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground">+ Nueva</Link>
      </header>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const count = t.v === "todas" ? (data?.length ?? 0) : (data || []).filter((p: any) => p.operation === t.v).length;
          const active = op === t.v;
          return (
            <button key={t.v} onClick={() => setOp(t.v)} className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${active ? "bg-ink text-brand-foreground border-ink" : "bg-card hover:bg-surface-2"}`}>
              {t.label} <span className={`ml-1 text-xs ${active ? "opacity-70" : "text-muted-foreground"}`}>({count})</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? <div className="p-10 text-center text-muted-foreground">Cargando…</div> :
          filtered.length === 0 ? <div className="p-12 text-center text-muted-foreground">No hay propiedades para este filtro.</div> :
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="p-3">Propiedad</th><th className="p-3">Operación</th><th className="p-3">Estado</th><th className="p-3">Precio</th><th className="p-3 text-right">Acciones</th></tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => {
                const img = Array.isArray(p.images) ? p.images[0] : undefined;
                return (
                  <tr key={p.id} className="border-t hover:bg-surface-2/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                          {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-semibold">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.property_type} · {p.neighborhood || p.city || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3"><span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">{operationLabel[p.operation]}</span></td>
                    <td className="p-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{statusLabel[p.status]}</span></td>
                    <td className="p-3">{formatPrice(p)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleFeatured(p.id, p.featured)} title="Destacar" className={`p-2 rounded-md hover:bg-secondary ${p.featured ? "text-brand" : "text-muted-foreground"}`}><Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} /></button>
                        <Link to="/admin/propiedades/$id" params={{ id: p.id }} title="Editar" className="p-2 rounded-md hover:bg-secondary text-primary"><Edit className="h-4 w-4" /></Link>
                        {p.status === "archivada"
                          ? <button onClick={() => unarchive(p.id)} title="Desarchivar" className="p-2 rounded-md hover:bg-secondary text-primary"><ArchiveRestore className="h-4 w-4" /></button>
                          : <button onClick={() => archive(p.id)} title="Archivar" className="p-2 rounded-md hover:bg-secondary"><Archive className="h-4 w-4" /></button>}
                        <button onClick={() => remove(p.id)} title="Eliminar" className="p-2 rounded-md hover:bg-secondary text-brand"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>}
      </div>
    </div>
  );
}
