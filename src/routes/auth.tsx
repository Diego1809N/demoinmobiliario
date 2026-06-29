import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wordmark } from "@/components/site/Wordmark";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acceso — Andina Propiedades" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Bienvenido"); navigate({ to: "/admin" }); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-ink">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/70 via-ink/40 to-transparent" />
        <div className="relative h-full p-12 flex flex-col justify-between text-white">
          <Link to="/"><Wordmark variant="light" /></Link>
          <div>
            <h2 className="font-serif text-4xl font-medium max-w-md">Panel de administración</h2>
            <p className="mt-3 max-w-md text-white/75">Gestioná propiedades, mensajes y configuración del sitio.</p>
          </div>
          <p className="text-xs text-white/60">© {new Date().getFullYear()} Andina Propiedades</p>
        </div>
      </div>
      <div className="grid place-items-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div>
            <h1 className="font-serif text-3xl font-medium">Acceso</h1>
            <p className="text-sm text-muted-foreground mt-1">Iniciá sesión para administrar el sitio.</p>
          </div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Contraseña" className="w-full rounded-lg border px-3 py-2.5 text-sm bg-background" />
          <button disabled={loading} className="w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 hover:bg-ink/85 transition">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-ink">← Volver al sitio</Link>
        </form>
      </div>
    </div>
  );
}
