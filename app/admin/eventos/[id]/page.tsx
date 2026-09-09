import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

function getAdminToken() {
  const password = process.env.ADMIN_ACCESS_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_ACCESS_PASSWORD no está configurada.');
  }

  return createHash('sha256').update(password).digest('hex');
}

export default async function AdminEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();

  const authenticated =
    cookieStore.get('qhc_admin_session')?.value === getAdminToken();

  if (!authenticated) {
    redirect('/admin');
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '40px 20px 80px',
        color: '#201733',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/admin"
          style={{
            color: '#6f32e8',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          ← Volver a eventos pendientes
        </Link>

        <div
          style={{
            marginTop: 26,
            background: '#fff',
            borderRadius: 22,
            padding: 32,
            boxShadow: '0 16px 45px rgba(70, 42, 120, 0.08)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: '#eee5ff',
              color: '#6f32e8',
              padding: '6px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            {event.status === 'PENDING_REVIEW'
              ? 'PENDIENTE DE APROBACIÓN'
              : event.status}
          </span>

          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 38,
            }}
          >
            {event.title}
          </h1>

          <p
            style={{
              margin: '0 0 30px',
              color: '#6f657f',
              fontSize: 16,
            }}
          >
            {event.category}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              marginBottom: 30,
            }}
          >
            <InfoBox label="Fecha" value={event.event_date} />
            <InfoBox label="Hora" value={event.event_time} />
            <InfoBox label="Lugar" value={event.place} />
            <InfoBox label="Dirección" value={event.address} />
            <InfoBox label="Tipo de entrada" value={event.entry_type} />
            <InfoBox
              label="Precio"
              value={
                event.entry_type === 'Paga' && event.price !== null
                  ? `$ ${event.price}`
                  : '—'
              }
            />
          </div>

          <div
            style={{
              borderTop: '1px solid #eee8f5',
              paddingTop: 24,
            }}
          >
            <h2 style={{ margin: '0 0 10px', fontSize: 20 }}>
              Descripción
            </h2>

            <p
              style={{
                margin: 0,
                lineHeight: 1.7,
                color: '#5f5570',
                whiteSpace: 'pre-wrap',
              }}
            >
              {event.description}
            </p>
          </div>

          {event.cover_image_url && (
            <div
              style={{
                borderTop: '1px solid #eee8f5',
                marginTop: 26,
                paddingTop: 24,
              }}
            >
              <h2 style={{ margin: '0 0 14px', fontSize: 20 }}>
                Imagen de portada
              </h2>

              <img
                src={event.cover_image_url}
                alt={`Portada de ${event.title}`}
                style={{
                  width: '100%',
                  maxHeight: 420,
                  objectFit: 'cover',
                  borderRadius: 16,
                }}
              />
            </div>
          )}

          <div
            style={{
              borderTop: '1px solid #eee8f5',
              marginTop: 30,
              paddingTop: 24,
            }}
          >
            <h2 style={{ margin: '0 0 14px', fontSize: 20 }}>
              Revisión administrativa
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6f657f',
                lineHeight: 1.6,
              }}
            >
              En el próximo paso agregaremos acá los botones
              <strong> Aprobar</strong>, <strong>Pedir cambios</strong> y
              <strong> Rechazar</strong>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div
      style={{
        background: '#faf8ff',
        border: '1px solid #eee8f5',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          color: '#6f32e8',
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div style={{ fontWeight: 700 }}>
        {value === null || value === '' ? '—' : value}
      </div>
    </div>
  );
}
