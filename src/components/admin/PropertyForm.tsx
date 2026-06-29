import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Upload, X } from "lucide-react";
import { LocationPicker } from "@/components/admin/LocationPicker";

interface Props { id?: string; }

const propertyTypes = ["Casa", "Departamento", "PH", "Finca", "Terreno", "Local comercial", "Oficina", "Cochera", "Galpón"];

type Currency = "USD" | "ARS";

const SIGNED_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

export function PropertyForm({ id }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<any>({
    title: "", property_type: "Casa", operation: "venta", status: "disponible",
    short_description: "", long_description: "",
    address: "", neighborhood: "", city: "Salta", latitude: "", longitude: "",
    currency: "USD" as Currency, price: "", consult_price: false,
    bedrooms: "", bathrooms: "", covered_m2: "", total_m2: "",
    has_garage: false, has_pool: false, has_balcony: false,
    images: [] as string[], video_url: "", featured: false,
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("properties").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (!data) return;
      const currency: Currency = data.price_ars != null && data.price_usd == null ? "ARS" : "USD";
      setForm({
        ...data,
        currency,
        price: currency === "USD" ? (data.price_usd ?? "") : (data.price_ars ?? ""),
        images: Array.isArray(data.images) ? data.images : [],
      });
    });
  }, [id]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("properties").upload(path, file, { upsert: false });
      if (up.error) { toast.error(up.error.message); continue; }
      const signed = await supabase.storage.from("properties").createSignedUrl(path, SIGNED_TTL);
      if (signed.error || !signed.data?.signedUrl) { toast.error(signed.error?.message || "No se pudo firmar URL"); continue; }
      uploaded.push(signed.data.signedUrl);
    }
    set("images", [...form.images, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (url: string) => set("images", form.images.filter((u: string) => u !== url));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const priceNum = form.price === "" || form.price == null ? null : Number(form.price);
    const payload: any = {
      title: form.title,
      property_type: form.property_type,
      operation: form.operation,
      status: form.status,
      short_description: form.short_description || null,
      long_description: form.long_description || null,
      address: form.address || null,
      neighborhood: form.neighborhood || null,
      city: form.city || null,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
      consult_price: !!form.consult_price,
      price_usd: form.consult_price ? null : (form.currency === "USD" ? priceNum : null),
      price_ars: form.consult_price ? null : (form.currency === "ARS" ? priceNum : null),
      bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === "" ? null : Number(form.bathrooms),
      covered_m2: form.covered_m2 === "" ? null : Number(form.covered_m2),
      total_m2: form.total_m2 === "" ? null : Number(form.total_m2),
      has_garage: !!form.has_garage,
      has_pool: !!form.has_pool,
      has_balcony: !!form.has_balcony,
      featured: !!form.featured,
      images: form.images,
      video_url: form.video_url || null,
    };
    const res = id
      ? await supabase.from("properties").update(payload).eq("id", id)
      : await supabase.from("properties").insert(payload);
    setLoading(false);
    if (res.error) toast.error(res.error.message);
    else { toast.success(id ? "Actualizada" : "Creada"); navigate({ to: "/admin/propiedades" }); }
  };

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl">
      <Section title="Información principal">
        <Field label="Título"><input required value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} /></Field>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Tipo">
            <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)} className={inp}>
              {propertyTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Operación">
            <select value={form.operation} onChange={(e) => set("operation", e.target.value)} className={inp}>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="temporario">Temporario</option>
            </select>
          </Field>
          <Field label="Estado">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inp}>
              <option value="disponible">Disponible</option>
              <option value="reservada">Reservada</option>
              <option value="vendida">Vendida</option>
              <option value="alquilada">Alquilada</option>
              <option value="archivada">Archivada</option>
            </select>
          </Field>
        </div>
        <Field label="Descripción corta"><input value={form.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} className={inp} /></Field>
        <Field label="Descripción larga"><textarea rows={5} value={form.long_description ?? ""} onChange={(e) => set("long_description", e.target.value)} className={inp} /></Field>
      </Section>

      <Section title="Ubicación">
        <Field label="Dirección"><input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} className={inp} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Barrio"><input value={form.neighborhood ?? ""} onChange={(e) => set("neighborhood", e.target.value)} className={inp} /></Field>
          <Field label="Ciudad"><input value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} className={inp} /></Field>
        </div>
        <div>
          <span className="block text-xs font-medium text-ink/70 mb-1">Ubicación en el mapa</span>
          <LocationPicker
            lat={form.latitude === "" || form.latitude == null ? null : Number(form.latitude)}
            lng={form.longitude === "" || form.longitude == null ? null : Number(form.longitude)}
            onChange={(la, ln) => setForm((f: any) => ({ ...f, latitude: la, longitude: ln }))}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Latitud"><input value={form.latitude ?? ""} onChange={(e) => set("latitude", e.target.value)} className={inp} /></Field>
          <Field label="Longitud"><input value={form.longitude ?? ""} onChange={(e) => set("longitude", e.target.value)} className={inp} /></Field>
        </div>
      </Section>

      <Section title="Precio">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.consult_price} onChange={(e) => set("consult_price", e.target.checked)} />
          Mostrar como "Consultar precio" en el sitio (el precio se sigue cargando para uso interno)
        </label>
        <div className="grid sm:grid-cols-[140px_1fr] gap-4">
          <Field label="Moneda">
            <select value={form.currency} onChange={(e) => set("currency", e.target.value as Currency)} className={inp}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </Field>
          <Field label={`Precio (${form.currency})`}>
            <input type="number" min="0" value={form.price ?? ""} onChange={(e) => set("price", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={inp} />
          </Field>
        </div>
      </Section>

      <Section title="Características">
        <div className="grid sm:grid-cols-4 gap-4">
          <Field label="Dormitorios"><input type="number" value={form.bedrooms ?? ""} onChange={(e) => set("bedrooms", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={inp} /></Field>
          <Field label="Baños"><input type="number" value={form.bathrooms ?? ""} onChange={(e) => set("bathrooms", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={inp} /></Field>
          <Field label="m² cubiertos"><input type="number" value={form.covered_m2 ?? ""} onChange={(e) => set("covered_m2", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={inp} /></Field>
          <Field label="m² totales"><input type="number" value={form.total_m2 ?? ""} onChange={(e) => set("total_m2", e.target.value)} onWheel={(e) => (e.target as HTMLInputElement).blur()} className={inp} /></Field>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.has_garage} onChange={(e) => set("has_garage", e.target.checked)} /> Cochera</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.has_pool} onChange={(e) => set("has_pool", e.target.checked)} /> Pileta</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.has_balcony} onChange={(e) => set("has_balcony", e.target.checked)} /> Balcón</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Destacada</label>
        </div>
      </Section>

      <Section title="Galería">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-border px-4 py-3 text-sm font-medium hover:bg-surface-2">
          <Upload className="h-4 w-4" /> {uploading ? "Subiendo..." : "Subir imágenes"}
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files)} />
        </label>
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((url: string) => (
              <div key={url} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        <Field label="URL de video (YouTube/Vimeo, opcional)"><input value={form.video_url ?? ""} onChange={(e) => set("video_url", e.target.value)} className={inp} /></Field>
      </Section>

      <div className="flex gap-3">
        <button disabled={loading} className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground hover:opacity-90 disabled:opacity-60">
          {loading ? "Guardando..." : (id ? "Guardar cambios" : "Crear propiedad")}
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/propiedades" })} className="rounded-full border px-6 py-3 text-sm font-semibold">Cancelar</button>
      </div>
    </form>
  );
}

const inp = "w-full rounded-lg border px-3 py-2.5 text-sm bg-background";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-medium text-ink/70 mb-1">{label}</span>{children}</label>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 space-y-4">
      <h2 className="font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}
