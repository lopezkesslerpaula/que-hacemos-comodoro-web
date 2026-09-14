'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type EventRow = {
  id: string | number;
  status: string;
};

type Stats = {
  total: number;
  published: number;
  pending: number;
  changesRequested: number;
};

export default function PerfilOrganizadorPage() {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    pending: 0,
    changesRequested: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
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
        .select('id, status')
        .eq('organizer_id', user.id);

      if (error) {
        console.error('Error cargando estadísticas:', error);
        setLoading(false);
        return;
      }

      const events = (data ?? []) as EventRow[];

      setStats({
        total: events.length,
        published: events.filter(
          (event) => event.status === 'PUBLISHED'
        ).length,
        pending: events.filter(
          (event) => event.status === 'PENDING_REVIEW'
        ).length,
        changesRequested: events.filter(
          (event) => event.status === 'CHANGES_REQUESTED'
        ).length,
      });

      setLoading(false);
    }

    loadStats();
  }, [router]);
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = '/';
}
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '40px 20px',
        color: '#201733',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
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
<button
  type="button"
  onClick={handleLogout}
  style={{
    display: 'block',
    marginTop: 12,
    border: 0,
    background: 'transparent',
    padding: 0,
    color: '#6f32e8',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
  }}
>
  Cerrar sesión
</button>
        <div style={{ marginTop: 30 }}>
          <span
            style={{
              color: '#6f32e8',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            ORGANIZADORES
          </span>

          <h1
            style={{
              fontSize: 34,
              margin: '6px 0 6px',
            }}
          >
            Mi perfil
          </h1>

          <p
            style={{
              color: '#6f657f',
              marginTop: 0,
            }}
          >
            Resumen de tus eventos en Qué Hacemos Comodoro.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 24,
              marginTop: 28,
            }}
          >
            Cargando estadísticas...
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 16,
                marginTop: 28,
              }}
            >
              <StatCard
                icon="📅"
                label="Total de eventos"
                value={stats.total}
              />

              <StatCard
                icon="✅"
                label="Publicados"
                value={stats.published}
              />

              <StatCard
                icon="⏳"
                label="Pendientes"
                value={stats.pending}
              />

              <StatCard
                icon="✏️"
                label="Cambios solicitados"
                value={stats.changesRequested}
              />
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: 18,
                padding: 24,
                marginTop: 22,
                boxShadow:
                  '0 12px 35px rgba(70, 42, 120, 0.06)',
              }}
            >
              <h2
                style={{
                  margin: '0 0 8px',
                  fontSize: 21,
                }}
              >
                Gestión de eventos
              </h2>

              <p
                style={{
                  color: '#6f657f',
                  margin: '0 0 20px',
                }}
              >
                Consultá tus publicaciones o cargá un nuevo evento.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href="/mis-eventos"
                  style={{
                    background: '#6f32e8',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '12px 18px',
                    borderRadius: 11,
                    fontWeight: 800,
                  }}
                >
                  Ver mis eventos
                </Link>

                <Link
                  href="/publicar"
                  style={{
                    background: '#f1eaff',
                    color: '#6f32e8',
                    textDecoration: 'none',
                    padding: '12px 18px',
                    borderRadius: 11,
                    fontWeight: 800,
                  }}
                >
                  + Publicar evento
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee8f5',
        borderRadius: 18,
        padding: 22,
        boxShadow: '0 12px 35px rgba(70, 42, 120, 0.06)',
      }}
    >
      <div style={{ fontSize: 24 }}>{icon}</div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          marginTop: 12,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: '#6f657f',
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
