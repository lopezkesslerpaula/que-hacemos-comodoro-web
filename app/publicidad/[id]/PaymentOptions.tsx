'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Props = {
  requestId: string;
  homePrice: number;
  popupPrice: number;
};

export default function PaymentOptions({
  requestId,
  homePrice,
  popupPrice,
}: Props) {
  const [selected, setSelected] = useState<'HOME' | 'POPUP' | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function selectOption(adType: 'HOME' | 'POPUP', price: number) {
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('advertising_requests')
      .update({
        selected_ad_type: adType,
        price: price,
      })
      .eq('id', requestId);

    if (error) {
      console.error(error);
      setMessage('No pudimos guardar la opción. Intentá nuevamente.');
      setSaving(false);
      return;
    }

    setSelected(adType);
    setMessage('Opción seleccionada correctamente.');
    setSaving(false);
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 14,
        marginTop: 20,
      }}
    >
      <button
        type="button"
        disabled={saving}
        onClick={() => selectOption('HOME', homePrice)}
        style={{
          textAlign: 'left',
          background: selected === 'HOME' ? '#ede9fe' : '#ffffff',
          border:
            selected === 'HOME'
              ? '2px solid #6d28d9'
              : '1px solid #ddd5eb',
          borderRadius: 12,
          padding: 18,
          cursor: saving ? 'default' : 'pointer',
          color: '#1f1633',
        }}
      >
        <strong>Publicidad en pantalla de inicio</strong>
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          ${Number(homePrice).toLocaleString('es-AR')}
        </div>
        <div style={{ marginTop: 8, color: '#6b6475' }}>
          Duración: 10 días
        </div>
      </button>

      <button
        type="button"
        disabled={saving}
        onClick={() => selectOption('POPUP', popupPrice)}
        style={{
          textAlign: 'left',
          background: selected === 'POPUP' ? '#ede9fe' : '#ffffff',
          border:
            selected === 'POPUP'
              ? '2px solid #6d28d9'
              : '1px solid #ddd5eb',
          borderRadius: 12,
          padding: 18,
          cursor: saving ? 'default' : 'pointer',
          color: '#1f1633',
        }}
      >
        <strong>Publicidad emergente</strong>
        <div
          style={{
            marginTop: 8,
            fontSize: 24,
            fontWeight: 900,
          }}
        >
          ${Number(popupPrice).toLocaleString('es-AR')}
        </div>
        <div style={{ marginTop: 8, color: '#6b6475' }}>
          Duración: 10 días
        </div>
      </button>

      {message && (
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontWeight: 800,
            color: '#6d28d9',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
