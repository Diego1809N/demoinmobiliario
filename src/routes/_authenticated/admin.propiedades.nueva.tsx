import { createFileRoute } from "@tanstack/react-router";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/_authenticated/admin/propiedades/nueva")({
  component: () => (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Nueva propiedad</h1>
      <PropertyForm />
    </div>
  ),
});
