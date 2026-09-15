'use client';

import { useState } from 'react';

type ShareButtonProps = {
  title: string;
};

export default function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Mirá este evento en Qué Hacemos Comodoro: ${title}`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error al compartir el evento:', error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      style={{
        padding: '12px 18px',
        background: '#fff',
        color: '#6f32e8',
        border: '1px solid #6f32e8',
        borderRadius: 12,
        fontWeight: 800,
        cursor: 'pointer',
      }}
    >
      {copied ? '✓ Enlace copiado' : '↗ Compartir'}
    </button>
  );
}
