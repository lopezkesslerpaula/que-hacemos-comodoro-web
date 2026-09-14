'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type EventData = {
  id: string | number;
  title: string;
  category: string;
  event_date: string;
  event_time: string;
  place: string;
  address: string;
  entry_type: string;
  price: number | null;
  description: string;
  status: string;
  moderation_message: string | null;
};

export default function EditarEventoPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = String(params.id ?? '');

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadEvent() {
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
          'id, title, category, event_date, event_time, place, address, entry_type, price, description, status, moderation_message'
        )
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single();

      if (error || !data) {
        setErrorMessage('No pudimos encontrar este evento.');
        setLoading(false);
        return;
      }

      if (data.status !== 'CHANGES_REQUESTED') {
        router.replace('/mis-eventos');
        return;
      }

      setEventData(data as EventData);
      setLoading(false);
    }

    loadEvent();
  }, [eventId, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    setSaving(true);
    setErrorMessage('');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace('/login');
      return;
    }

    const form = new FormData(formElement);

    const priceValue = String(form.get('price') ?? '').trim();

    const { error } = await supabase
      .from('events')
      .update({
        title: String(form.get('title') ?? '').trim(),
        category: String(form.get('category') ?? ''),
        event_date: String(form.get('event_date') ?? ''),
        event_time: String(form.get('event_time') ?? ''),
        place: String(form.get('place') ?? '').trim(),
        address: String(form.get('address') ?? '').trim(),
        entry_type: String(form.get('entry_type') ?? ''),
        price: priceValue ? Number(priceValue) : null,
        description: String(form.get('description') ?? '').trim(),
        status: 'PENDING_REVIEW',
        moderation_message: null,
      })
      .eq('id', eventId)
      .eq('organizer_id', user.id)
      .eq('status', 'CHANGES_REQUESTED');

    if (error) {
      console.error('Error actualizando evento:', error);
      setErrorMessage('No pudimos guardar los cambios.');
      setSaving(false);
      return;
    }

    router.push('/mis-eventos');
    router.refresh();
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontWeight: 800 }}>Cargando evento...</p>
        </div>
      </main>
    );
  }

  if (!eventData) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link href="/mis-eventos" style={backStyle}>
            ← Volver a Mis eventos
          </Link>

          <div style={cardStyle}>
            <h1>No encontramos el evento</h1>
            <p>{errorMessage}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ width: '100%', maxWidth: 760, margin: '0 auto' }}>
        <Link href="/mis-eventos" style={backStyle}>
          ← Volver a Mis eventos
        </Link>

        <div style={cardStyle}>
          <span
            style={{
              color: '#9a6200',
              background: '#fff2d9',
              padding: '6px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            CAMBIOS SOLICITADOS
          </span>

          <h1 style={{ margin: '16px 0 8px', fontSize: 32 }}>
            Corregir evento
          </h1>

          <p style={{ color: '#6f657f', marginTop: 0 }}>
            Modificá los datos solicitados y volvé a enviar el evento para
            revisión.
          </p>

          {eventData.moderation_message && (
            <div
              style={{
                background: '#fff7e8',
                border: '1px solid #f3d69b',
                borderRadius: 12,
                padding: 15,
                margin: '20px 0 24px',
                color: '#6f4b00',
                lineHeight: 1.6,
              }}
            >
              <strong>La administradora solicitó:</strong>
              <div style={{ marginTop: 5 }}>
                {eventData.moderation_message}
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                background: '#fff0f2',
                color: '#a4283a',
                padding: 14,
                borderRadius: 12,
                marginBottom: 18,
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>
              Nombre del evento
              <input
                required
                name="title"
                defaultValue={eventData.title}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Categoría
              <select
                required
                name="category"
                defaultValue={eventData.category}
                style={inputStyle}
              >
                <option value="Música">Música</option>
                <option value="Cultura">Cultura</option>
                <option value="Deportes">Deportes</option>
                <option value="Ferias">Ferias</option>
                <option value="Gastronomía">Gastronomía</option>
                <option value="Arte">Arte</option>
                <option value="Familia">Familia</option>
                <option value="Fiestas">Fiestas</option>
                <option value="Educación">Educación</option>
                <option value="Comunidad">Comunidad</option>
              </select>
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
              }}
            >
              <label style={labelStyle}>
                Fecha
                <input
                  required
                  type="date"
                  name="event_date"
                  defaultValue={eventData.event_date}
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Hora
                <input
                  required
                  type="time"
                  name="event_time"
                  defaultValue={eventData.event_time?.slice(0, 5)}
                  style={inputStyle}
                />
              </label>
            </div>

            <label style={labelStyle}>
              Lugar
              <input
                required
                name="place"
                defaultValue={eventData.place}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Dirección
              <input
                required
                name="address"
                defaultValue={eventData.address}
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Tipo de entrada
              <select
                required
                name="entry_type"
                defaultValue={eventData.entry_type}
                style={inputStyle}
              >
                <option value="Gratis">Gratis</option>
                <option value="Paga">Paga</option>
                <option value="Consultar">Consultar</option>
              </select>
            </label>

            <label style={labelStyle}>
              Precio
              <input
                type="number"
                min="0"
                name="price"
                defaultValue={eventData.price ?? ''}
                placeholder="Dejar vacío si no corresponde"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Descripción
              <textarea
                required
                name="description"
                rows={6}
                defaultValue={eventData.description}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 12,
                background: '#6f32e8',
                color: '#fff',
                padding: 15,
                marginTop: 10,
                fontSize: 15,
                fontWeight: 900,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Enviando...' : 'Guardar y volver a enviar'}
            </button>
          </form>
        </div>
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

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 28,
  marginTop: 24,
  boxShadow: '0 16px 45px rgba(70, 42, 120, 0.08)',
};

const backStyle = {
  color: '#6f32e8',
  textDecoration: 'none',
  fontWeight: 800,
};

const labelStyle = {
  display: 'block',
  marginBottom: 16,
  fontWeight: 800,
  fontSize: 14,
};

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box' as const,
  border: '1px solid #ddd5eb',
  borderRadius: 12,
  padding: '12px 13px',
  marginTop: 7,
  fontSize: 14,
  background: '#fff',
  color: '#201733',
};
