import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Music2 } from "lucide-react";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-surface-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Wordmark />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Inmobiliaria de prueba con sede en General Güemes, Salta. Casas, departamentos y terrenos en el NOA argentino.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Navegación</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/propiedades" className="hover:text-ink">Propiedades</Link></li>
            <li><Link to="/nosotros" className="hover:text-ink">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-ink">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand" />+54 387 555 0123</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand" />contacto@silviajaramillo.com.ar</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-brand mt-0.5" />Av. Leandro N. Alem 245, General Güemes, Salta</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">Seguinos</h4>
          <div className="mt-3 flex gap-2">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border transition-all hover:bg-ink hover:text-white hover:border-ink"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="TikTok" className="grid h-9 w-9 place-items-center rounded-full border transition-all hover:bg-ink hover:text-white hover:border-ink"><Music2 className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full border transition-all hover:bg-ink hover:text-white hover:border-ink"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Silvia Jaramillo Negocios Inmobiliarios — sitio de prueba. Todos los derechos reservados.</p>
          <Link to="/auth" className="hover:text-ink">Acceso administradores</Link>
        </div>
      </div>
    </footer>
  );
}
