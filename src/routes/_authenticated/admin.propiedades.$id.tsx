import { createFileRoute } from "@tanstack/react-router";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const Route = createFileRoute("/_authenticated/admin/propiedades/$id")({
  component: EditProperty,
});

function EditProperty() {
  const { id } = Route.useParams();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-bold">Editar propiedad</h1>
      <PropertyForm id={id} />
    </div>
  );
}
