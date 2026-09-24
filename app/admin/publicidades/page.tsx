import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
export const dynamic = 'force-dynamic';
export default async function AdminPublicidadesPage() {
    const { data: requests, error } = await supabase
    .from('advertising_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '32px 20px 60px',
        color: '#1f1633',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Link
          href="/admin"
          style={{
            color: '#6d28d9',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ← Volver al panel
        </Link>

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              display: 'inline-block',
              background: '#eee7ff',
              color: '#6d28d9',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            ADMINISTRACIÓN
          </span>

          <h1 style={{ margin: '10px 0 6px', fontSize: 32 }}>
            Solicitudes de publicidad
          </h1>

          <p style={{ margin: 0, color: '#6b6475', lineHeight: 1.6 }}>
            Revisá las solicitudes de los comercios y administrá su publicación.
          </p>
          {error ? (
  <div style={{ marginTop: 24 }}>
    No se pudieron cargar las solicitudes.
  </div>
) : !requests || requests.length === 0 ? (
  <div style={{ marginTop: 24 }}>
    No hay solicitudes de publicidad.
  </div>
) : (
  <div style={{ marginTop: 24, display: 'grid', gap: 16 }}>
    {requests.map((request) => (
      <div
        key={request.id}
        style={{
          background: '#ffffff',
          border: '1px solid #e8def8',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>
          {request.business_name}
        </h2>

        <p style={{ margin: '4px 0' }}>
          <strong>Rubro:</strong> {request.category}
        </p>

        <p style={{ margin: '4px 0' }}>
          <strong>Contacto:</strong> {request.contact_name}
        </p>

        <p style={{ margin: '4px 0' }}>
          <strong>WhatsApp:</strong> {request.whatsapp}
        </p>

        <p style={{ margin: '4px 0' }}>
          <strong>Email:</strong> {request.email}
        </p>

        <p style={{ margin: '4px 0' }}>
          <strong>Estado:</strong> {request.status}
        </p>
        <Link
  href={`/admin/publicidades/${request.id}`}
  style={{
    display: 'inline-block',
    marginTop: 12,
    background: '#6d28d9',
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: 10,
    fontWeight: 800,
    textDecoration: 'none',
    fontSize: 14,
  }}
>
  Ver solicitud
</Link>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </main>
  );
}
