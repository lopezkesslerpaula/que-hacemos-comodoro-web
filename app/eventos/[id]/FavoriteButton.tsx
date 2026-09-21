'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function FavoriteButton({ eventId }: { eventId: string }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFavorite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('event_id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .maybeSingle();

      setIsFavorite(Boolean(data));
      setLoading(false);
    }

    checkFavorite();
  }, [eventId]);

  async function toggleFavorite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/login?next=/eventos/${eventId}`;
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (!error) setIsFavorite(false);
      return;
    }

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      event_id: eventId,
    });

    if (!error) setIsFavorite(true);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      style={{
        width: 42,
        height: 42,
        borderRadius: 999,
        border: '1px solid #e9d8ff',
        background: '#fff',
        color: '#6f32e8',
        fontSize: 22,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
}
