'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type OrganizerEvent = {
  id: string | number;
  title: string;
  category: string;
  event_date: string;
  event_time: string;
  place: string;
  status: string;
moderation_message: string | null;
};
const statusInfo: Record<
  string,
  { label: string; background: string; color: string }
> = {
  PENDING_REVIEW: {
    label: 'Pendiente de aprobación',
    background: '#eee5ff',
    color: '#6f32e8',
  },
  CHANGES_REQUESTED: {
    label: 'Cambios solicitados',
    background: '#fff2d9',
    color: '#9a6200',
  },
  PUBLISHED: {
    label: 'Publicado',
    background: '#e7f8ed',
    color: '#19733b',
  },
  REJECTED: {
    label: 'Rechazado',
    background: '#ffe8eb',
    color: '#a4283a',
  },
};

export default function MisEventosPage() {
  const router = useRouter();

  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadEvents() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .select(
      'id, title, category, event_date, event_time, place, status, moderation_message'
        )
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando mis eventos:', error);
        setErrorMessage('No pudimos cargar tus eventos.');
        setLoading(false);
        return;
      }

      setEvents((data ?? []) as OrganizerEvent[]);
      setLoading(false);
    }

    loadEvents();
  }, [router]);
async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error cerrando sesión:', error);
    setErrorMessage('No pudimos cerrar la sesión.');
    return;
  }

  router.replace('/');
  router.refresh();
}
  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <p style={{ fontWeight: 800 }}>Cargando tus eventos...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div
        style={{
          width: '100%',
          maxWidth: 850,
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            color: '#6f32e8',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          ← Volver al inicio
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            marginTop: 28,
            marginBottom: 26,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span
              style={{
                color: '#6f32e8',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              ORGANIZADORES
            </span>

            <h1
              style={{
                margin: '6px 0 5px',
                fontSize: 36,
              }}
            >
              Mis eventos
            </h1>

            <p
              style={{
                margin: 0,
                color: '#6f657f',
              }}
            >
              Administrá los eventos que enviaste.
            </p>
          </div>
<div
  style={{
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  }}
>
          <Link
            href="/publicar"
            style={{
              background: '#6f32e8',
              color: '#fff',
              textDecoration: 'none',
              padding: '13px 18px',
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            + Publicar evento
          </Link>
  <button
  type="button"
  onClick={handleSignOut}
  style={{
    background: '#fff',
    color: '#6f32e8',
    border: '1px solid #d8c8f7',
    padding: '13px 18px',
    borderRadius: 12,
    fontWeight: 800,
    cursor: 'pointer',
  }}
>
  Cerrar sesión
</button>
        </div>

        {errorMessage && (
          <div
            style={{
              background: '#fff0f2',
              color: '#a4283a',
              padding: 14,
              borderRadius: 12,
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            {errorMessage}
          </div>
        )}

        {!errorMessage && events.length === 0 ? (
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 36,
              textAlign: 'center',
              boxShadow: '0 16px 45px rgba(70, 42, 120, 0.08)',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>📅</div>

            <h2 style={{ margin: '0 0 8px' }}>
              Todavía no tenés eventos
            </h2>

            <p
              style={{
                color: '#6f657f',
                marginBottom: 22,
              }}
            >
              Cuando publiques uno, vas a poder seguir su estado desde acá.
            </p>

            <Link
              href="/publicar"
              style={{
                color: '#6f32e8',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Publicar mi primer evento →
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: 16,
            }}
          >
            {events.map((event) => {
              const currentStatus =
                statusInfo[event.status] ?? {
                  label: event.status,
                  background: '#f1eef6',
                  color: '#62596e',
                };

              return (
                <article
                  key={event.id}
                  style={{
                    background: '#fff',
                    borderRadius: 18,
                    padding: 22,
                    boxShadow:
                      '0 12px 35px rgba(70, 42, 120, 0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 20,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          background: currentStatus.background,
                          color: currentStatus.color,
                          padding: '6px 9px',
                          borderRadius: 999,
                          fontSize: 10,
                          fontWeight: 900,
                          marginBottom: 10,
                        }}
                      >
                        {currentStatus.label.toUpperCase()}
                      </span>

                      <h2
                        style={{
                          margin: '0 0 8px',
                          fontSize: 22,
                        }}
                      >
                        {event.title}
                      </h2>

                      <div
                        style={{
                          color: '#6f657f',
                          fontSize: 14,
                          lineHeight: 1.7,
                        }}
                      >
                        <div>
                          {event.category} · {event.event_date}
                        </div>

                        <div>
                          {event.event_time?.slice(0, 5)} · {event.place}
                        </div>
                      </div>
                    </div>
{event.status === 'CHANGES_REQUESTED' &&
  event.moderation_message && (
    <div
      style={{
        marginTop: 14,
        padding: 14,
        background: '#fff7e8',
        border: '1px solid #f3d69b',
        borderRadius: 12,
        color: '#6f4b00',
        fontSize: 14,
        lineHeight: 1.6,
      }}
    >
      <strong>Qué tenés que corregir:</strong>
      <div style={{ marginTop: 4 }}>
        {event.moderation_message}
      </div>
    </div>
  )}
                    {event.status === 'CHANGES_REQUESTED' ? (
                      <Link
                        href={`/mis-eventos/${event.id}/editar`}
                        style={buttonStyle}
                      >
                        Corregir evento →
                      </Link>
                    ) : event.status === 'PUBLISHED' ? (
                      <Link
                        href={`/eventos/${event.id}`}
                        style={buttonStyle}
                      >
                        Ver publicado →
                      </Link>
                    ) : (
                      <span
                        style={{
                          color: '#6f657f',
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        En seguimiento
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: '100vh',
  background: '#faf8ff',
  padding: '40px 20px',
  color: '#201733',
};

const buttonStyle = {
  display: 'inline-block',
  background: '#6f32e8',
  color: '#fff',
  textDecoration: 'none',
  padding: '11px 15px',
  borderRadius: 10,
  fontWeight: 800,
  fontSize: 14,
};
