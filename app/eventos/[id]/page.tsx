import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('status', 'PUBLISHED')
    .single();

  if (error || !event) {
    notFound();
  }

  const precio =
    event.entry_type === 'Paga' && event.price !== null
      ? `$ ${event.price}`
      : event.entry_type === 'Gratis'
        ? 'Gratis'
        : 'Consultar';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        color: '#120733',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <Link
          href="/#eventos"
          style={{
            color: '#6f32e8',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          ← Volver a eventos
        </Link>

        <article
          style={{
            marginTop: 24,
            background: '#fff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 16px 45px rgba(70, 42, 120, 0.08)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: '#efe5ff',
              color: '#6f32e8',
              borderRadius: 999,
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            {event.category}
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              fontSize: 42,
            }}
          >
            {event.title}
          </h1>

          <p
            style={{
              margin: '0 0 28px',
              color: '#6f657f',
            }}
          >
            Evento publicado en Qué Hacemos Comodoro
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            <InfoBox label="📅 Fecha" value={event.event_date} />
            <InfoBox
              label="🕐 Hora"
              value={String(event.event_time).slice(0, 5)}
            />
            <InfoBox label="📍 Lugar" value={event.place} />
            <InfoBox label="🗺️ Dirección" value={event.address} />
            <InfoBox label="🎟️ Entrada" value={event.entry_type} />
            <InfoBox label="💰 Precio" value={precio} />
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 24,
              borderTop: '1px solid #eee7f8',
            }}
          >
            <h2
              style={{
                margin: '0 0 12px',
                fontSize: 22,
              }}
            >
              Descripción
            </h2>

            <p
              style={{
                margin: 0,
                color: '#514763',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}
            >
              {event.description || 'Sin descripción.'}
            </p>
          </div>
        </article>
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
        border: '1px solid #eee5fb',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div
        style={{
          color: '#6f32e8',
          fontSize: 12,
          fontWeight: 800,
          marginBottom: 7,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 700,
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  );
}
