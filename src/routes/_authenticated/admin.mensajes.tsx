import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/mensajes")({
  component: Messages,
});

function Messages() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", "messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar mensaje?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminado"); qc.invalidateQueries({ queryKey: ["admin", "messages"] }); }
  };
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Mensajes</h1>
      <div className="space-y-3">
        {(data?.length ?? 0) === 0 ? <p className="text-muted-foreground">No hay mensajes aún.</p> :
          data!.map((m: any) => (
            <article key={m.id} className={`rounded-2xl border bg-card p-5 ${!m.read ? "border-primary/40 ring-1 ring-primary/20" : ""}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-brand" />}
                    {m.name} <span className="text-xs font-normal text-muted-foreground">· {new Date(m.created_at).toLocaleString("es-AR")}</span>
                  </p>
                  <p className="text-xs text-muted-foreground"><Mail className="inline h-3 w-3" /> {m.email} {m.phone && `· ${m.phone}`}</p>
                </div>
                <div className="flex gap-1">
                  {!m.read && <button onClick={() => markRead(m.id)} className="p-2 rounded-md hover:bg-secondary" title="Marcar leído"><Check className="h-4 w-4" /></button>}
                  <button onClick={() => remove(m.id)} className="p-2 rounded-md hover:bg-secondary text-brand"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{m.message}</p>
            </article>
          ))}
      </div>
    </div>
  );
}
