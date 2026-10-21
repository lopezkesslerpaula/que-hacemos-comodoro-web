
import PublicidadEstadoCliente from './PublicidadEstadoCliente';

export default async function PublicidadEstadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PublicidadEstadoCliente id={id} />;
}
