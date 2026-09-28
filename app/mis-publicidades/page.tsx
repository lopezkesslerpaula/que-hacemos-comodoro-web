'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function MisPublicidadesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    async function cargarSolicitudes() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('advertising_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRequests(data);
      }

      setLoading(false);
    }

    cargarSolicitudes();
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '32px 20px 60px',
        color: '#1f1633',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <Link
          href="/publicite-aqui"
          style={{
            color: '#6d28d9',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ← Volver a Publicitá aquí
        </Link>

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              display: 'inline-block',
              background: '#ede9fe',
              color: '#6d28d9',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            PUBLICIDAD
          </span>

          <h1 style={{ margin: '10px 0 6px', fontSize: 32 }}>
            Mis solicitudes de publicidad
          </h1>

          <p style={{ margin: 0, color: '#6b6475', lineHeight: 1.6 }}>
            Consultá el estado de tus solicitudes y los presupuestos enviados.
          </p>
        </div>

        {loading ? (
          <div
            style={{
              marginTop: 24,
              background: '#ffffff',
              border: '1px solid #ddd5eb',
              borderRadius: 12,
              padding: 18,
            }}
          >
            Cargando solicitudes...
          </div>
        ) : !loggedIn ? (
          <div
            style={{
              marginTop: 24,
              background: '#ffffff',
              border: '1px solid #ddd5eb',
              borderRadius: 12,
              padding: 18,
            }}
          >
            Tenés que iniciar sesión para ver tus solicitudes de publicidad.
          </div>
        ) : requests.length === 0 ? (
          <div
            style={{
              marginTop: 24,
              background: '#ffffff',
              border: '1px solid #ddd5eb',
              borderRadius: 12,
              padding: 18,
            }}
          >
            Todavía no tenés solicitudes de publicidad.
          </div>
        ) : (
          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gap: 14,
            }}
          >
            {requests.map((request) => (
              <div
                key={request.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #ddd5eb',
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <h2
                  style={{
                    margin: '0 0 10px',
                    fontSize: 20,
                  }}
                >
                  {request.business_name}
                </h2>

                <p style={{ margin: '4px 0' }}>
                  <strong>Rubro:</strong> {request.category}
                </p>

                <p style={{ margin: '4px 0' }}>
                  <strong>Estado:</strong> {request.status}
                </p>

                <Link
                  href={`/publicidad/${request.id}`}
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
                  Ver solicitud →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
