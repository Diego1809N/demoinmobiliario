import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Home as HomeIcon, MessageSquare, LogOut, Bell } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Wordmark } from "@/components/site/Wordmark";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/propiedades", label: "Propiedades", icon: HomeIcon },
  { to: "/admin/mensajes", label: "Mensajes", icon: MessageSquare, key: "mensajes" as const },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  const { data: unread = 0 } = useQuery({
    queryKey: ["admin", "messages", "unread-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("read", false);
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("admin-contact-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          const m = payload.new as { name?: string };
          toast.success("Nuevo mensaje recibido", {
            description: m?.name ? `De: ${m.name}` : undefined,
            action: {
              label: "Ver",
              onClick: () => navigate({ to: "/admin/mensajes" }),
            },
          });
          qc.invalidateQueries({ queryKey: ["admin", "messages"] });
          qc.invalidateQueries({ queryKey: ["admin", "messages", "unread-count"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contact_messages" },
        () => {
          qc.invalidateQueries({ queryKey: ["admin", "messages", "unread-count"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "contact_messages" },
        () => {
          qc.invalidateQueries({ queryKey: ["admin", "messages", "unread-count"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, qc]);

  return (
    <div className="relative min-h-screen grid lg:grid-cols-[260px_1fr]">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "#f7f2ea" }} />
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-32 -right-20 h-[26rem] w-[26rem] rounded-full opacity-35 blur-3xl" style={{ background: "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/75 backdrop-blur-2xl" />
      </div>
      <aside className="border-r bg-white/60 backdrop-blur-xl lg:min-h-screen">
        <div className="p-5 border-b flex items-start justify-between gap-2">
          <Link to="/">
            <Wordmark />
            <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">Panel privado</p>
          </Link>
          <Link
            to="/admin/mensajes"
            className="relative p-2 rounded-full hover:bg-secondary text-ink/70"
            title={unread > 0 ? `${unread} mensaje${unread === 1 ? "" : "s"} sin leer` : "Sin mensajes nuevos"}
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center animate-pulse">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            const Icon = it.icon;
            const showBadge = it.key === "mensajes" && unread > 0;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? "bg-accent text-primary" : "text-ink/70 hover:bg-secondary"}`}
              >
                <Icon className="h-4 w-4" /> <span className="flex-1">{it.label}</span>
                {showBadge && (
                  <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold grid place-items-center">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink/70 hover:bg-secondary">
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </aside>
      <main className="p-6 sm:p-10">{children}</main>
    </div>
  );
}
