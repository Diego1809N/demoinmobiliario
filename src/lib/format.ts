export function formatUSD(n: number | null | undefined) {
  if (n == null) return "";
  return `U$D ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n)}`;
}
export function formatARS(n: number | null | undefined) {
  if (n == null) return "";
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}
export function formatPrice(p: { price_usd: number | null; price_ars: number | null; consult_price: boolean }) {
  if (p.consult_price) return "Consultar";
  if (p.price_usd != null) return formatUSD(Number(p.price_usd));
  if (p.price_ars != null) return formatARS(Number(p.price_ars));
  return "Consultar";
}
export const operationLabel: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  temporario: "Alquiler Temporario",
};
export const statusLabel: Record<string, string> = {
  disponible: "Disponible",
  vendida: "Vendida",
  alquilada: "Alquilada",
  reservada: "Reservada",
  archivada: "Archivada",
};
