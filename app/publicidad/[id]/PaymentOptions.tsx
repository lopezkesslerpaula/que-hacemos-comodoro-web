'use client';

import { useState } from 'react';

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

   const response = await fetch('/api/advertising/select-option', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestId,
    adType,
  }),
});

const result = await response.json();

    if (!response.ok) {
      console.error(result);
      setMessage('No pudimos guardar la opción. Intentá nuevamente.');
      setSaving(false);
      return;
    }

    setSelected(adType);
    setMessage('Opción seleccionada correctamente.');
    setSaving(false);
  }

  async function continueToPayment() {
  if (!selected) {
    setMessage('Primero elegí una opción de publicidad.');
    return;
  }

  setSaving(true);
  setMessage('');

  try {
    const response = await fetch('/api/mercadopago/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        adType: selected,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      setMessage('No pudimos iniciar el pago. Intentá nuevamente.');
      setSaving(false);
      return;
    }

    const paymentUrl = result.initPoint || result.sandboxInitPoint;

    if (!paymentUrl) {
      setMessage('No pudimos obtener el enlace de pago.');
      setSaving(false);
      return;
    }

    window.location.href = paymentUrl;
  } catch (error) {
    console.error(error);
    setMessage('No pudimos iniciar el pago. Intentá nuevamente.');
    setSaving(false);
  }
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
{selected && (
  <button
    type="button"
    disabled={saving}
    onClick={continueToPayment}
    style={{
      width: '100%',
      marginTop: 16,
      padding: '14px 18px',
      background: '#6d28d9',
      color: '#ffffff',
      border: 'none',
      borderRadius: 10,
      fontWeight: 900,
      fontSize: 16,
      cursor: saving ? 'default' : 'pointer',
    }}
  >
    {saving
      ? 'Procesando...'
      : `Continuar al pago – $${Number(
          selected === 'HOME' ? homePrice : popupPrice
        ).toLocaleString('es-AR')}`}
  </button>
)}
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
