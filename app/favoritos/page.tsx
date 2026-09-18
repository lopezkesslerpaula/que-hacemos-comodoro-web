'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type FavoriteEvent = {
  id: string;
  title: string;
  category: string;
  event_date: string;
  event_time: string;
  place: string;
  cover_image_url?: string | null;
};

export default function FavoritosPage() {
  const [events, setEvents] = useState<FavoriteEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login?next=/favoritos';
        return;
      }

      const { data: favorites, error } = await supabase
        .from('favorites')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cargando favoritos:', error);
        setLoading(false);
        return;
      }

      const eventIds = (favorites ?? []).map((item) => item.event_id);

      if (eventIds.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const { data: favoriteEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, title, category, event_date, event_time, place, cover_image_url')
        .in('id', eventIds)
        .eq('status', 'PUBLISHED')
        .order('event_date', { ascending: true })
.order('event_time', { ascending: true });

      if (eventsError) {
        console.error('Error cargando eventos favoritos:', eventsError);
        setLoading(false);
        return;
      }

      setEvents((favoriteEvents ?? []) as FavoriteEvent[]);
      setLoading(false);
    }

    loadFavorites();
  }, []);
const today = new Date().toISOString().slice(0, 10);

const upcomingEvents = events.filter(
  (event) => event.event_date >= today
);

const pastEvents = events
  .filter((event) => event.event_date < today)
  .sort((a, b) => {
    const dateA = `${a.event_date}T${a.event_time || '00:00'}`;
    const dateB = `${b.event_date}T${b.event_time || '00:00'}`;
    return dateB.localeCompare(dateA);
  });

  async function removeFavorite(eventId: string) {
 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = '/login?next=/favoritos';
    return;
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('event_id', eventId);

  if (error) {
    alert(`Error eliminando favorito: ${error.message}`);
    return;
  }

  setEvents((current) =>
    current.filter((event) => event.id !== eventId)
  );
}
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        color: '#201733',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
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

        <div style={{ marginTop: 30 }}>
          <span
            style={{
              color: '#6f32e8',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            TUS PLANES
          </span>

          <h1 style={{ fontSize: 34, margin: '6px 0' }}>
            Mis favoritos
          </h1>

          <p style={{ color: '#6f657f', marginTop: 0 }}>
            Los eventos que guardaste para no perdértelos.
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
            Cargando favoritos...
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              background: '#fff',
              borderRadius: 18,
              padding: 30,
              marginTop: 28,
            }}
          >
            <div style={{ fontSize: 32 }}>♡</div>
            <h2 style={{ marginBottom: 8 }}>
              Todavía no guardaste eventos
            </h2>
            <p style={{ color: '#6f657f' }}>
              Tocá el corazón de un evento para encontrarlo acá.
            </p>

            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginTop: 10,
                background: '#6f32e8',
                color: '#fff',
                padding: '12px 18px',
                borderRadius: 11,
                textDecoration: 'none',
                fontWeight: 800,
              }}
            >
              Explorar eventos
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 18,
              marginTop: 28,
            }}
          >
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: '#fff',
                  border: '1px solid #eee9f2',
                  borderRadius: 18,
                  padding: 20,
                }}
              >
               {event.cover_image_url && (
  <img
    src={event.cover_image_url}
    alt={`Portada de ${event.title}`}
    style={{
      width: '100%',
      height: 180,
      objectFit: 'cover',
      borderRadius: 14,
      marginBottom: 14,
      display: 'block',
    }}
  />
)}
                <button
  type="button"
  onClick={() => removeFavorite(event.id)}
  title="Quitar de favoritos"
  style={{
    fontSize: 28,
    border: 0,
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    color: '#6f32e8',
  }}
>
  ♥
</button>

                <div
                  style={{
                    color: '#6f32e8',
                    fontSize: 12,
                    fontWeight: 800,
                    marginTop: 14,
                  }}
                >
                  {event.category}
                </div>

                <h2 style={{ fontSize: 20, margin: '8px 0' }}>
                  {event.title}
                </h2>

                <p style={{ color: '#6f657f', fontSize: 14 }}>
                  {event.event_date} · {event.event_time}
                </p>

                <p style={{ color: '#6f657f', fontSize: 14 }}>
                  📍 {event.place}
                </p>

                <Link
                  href={`/eventos/${event.id}`}
                  style={{
                    color: '#6f32e8',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  Ver evento →
                </Link>
              </div>
            ))}
          </div>
        )}
        {pastEvents.length > 0 && (
  <div style={{ marginTop: 36 }}>
    <h2 style={{ fontSize: 22, margin: '0 0 6px' }}>
      Eventos pasados
    </h2>

    <p style={{ color: '#6f657f', margin: '0 0 18px' }}>
      Eventos que guardaste y que ya finalizaron.
    </p>

    <div style={{ display: 'grid', gap: 12 }}>
      {pastEvents.map((event) => (
        <div
          key={event.id}
          style={{
            background: '#fff',
            border: '1px solid #ece9f2',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <strong>{event.title}</strong>

          <div
            style={{
              color: '#6f657f',
              fontSize: 13,
              marginTop: 6,
            }}
          >
            {event.category} · {event.event_date} · {event.event_time}
          </div>

          <Link
            href={`/eventos/${event.id}`}
            style={{
              display: 'inline-block',
              color: '#6f32e8',
              fontWeight: 800,
              textDecoration: 'none',
              marginTop: 10,
            }}
          >
            Ver evento →
          </Link>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </main>
  );
}
