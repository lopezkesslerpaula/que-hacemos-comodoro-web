'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
export default function PubliciteAquiPage() {
    const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
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
          href="/"
          style={{
            color: '#6d28d9',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ← Volver al inicio
        </Link>

        <div
          style={{
            marginTop: 24,
            background: '#ffffff',
            borderRadius: 22,
            padding: 28,
            boxShadow: '0 10px 30px rgba(109, 40, 217, 0.06)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: '#f1e8ff',
              color: '#6d28d9',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            PARA COMERCIOS
          </span>

          <h1 style={{ margin: '12px 0 6px', fontSize: 32 }}>
            Publicitá en Qué Hacemos Comodoro
          </h1>

          <p
            style={{
              margin: '0 0 24px',
              color: '#6b6475',
              lineHeight: 1.5,
            }}
          >
            Completá tus datos y contanos qué querés promocionar.
            Revisaremos tu solicitud y nos pondremos en contacto con vos.
          </p>

          <form
            style={{
              display: 'grid',
              gap: 16,
            }}
          >
            <label style={labelStyle}>
              Nombre del negocio
              <input
                type="text"
                required
                placeholder="Ej. Restaurante Patagonia"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Rubro
              <select required defaultValue="" style={inputStyle}>
                <option value="" disabled>
                  Seleccionar rubro
                </option>
                <option>Gastronomía</option>
                <option>Gimnasio y deporte</option>
                <option>Indumentaria</option>
                <option>Belleza y estética</option>
                <option>Turismo</option>
                <option>Servicios</option>
                <option>Comercio</option>
                <option>Otro</option>
              </select>
            </label>

            <label style={labelStyle}>
              Nombre de contacto
              <input
                type="text"
                required
                placeholder="Nombre y apellido"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              WhatsApp
              <input
                type="tel"
                required
                placeholder="Ej. 297 4000000"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Email
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              Instagram o página web
              <input
                type="text"
                placeholder="@tunegocio o sitio web"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              ¿Qué querés promocionar?
              <textarea
                required
                placeholder="Contanos brevemente qué querés promocionar..."
                style={{
                  ...inputStyle,
                  minHeight: 110,
                  resize: 'vertical',
                }}
              />
            </label>

            <label style={labelStyle}>
              Imagen o logo
              <input
                type="file"
                accept="image/*"
                style={inputStyle}
              />
            </label>

            <div
              style={{
                background: '#faf7ff',
                border: '1px solid #e9d5ff',
                borderRadius: 14,
                padding: 14,
                color: '#62566f',
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              La solicitud será revisada antes de publicarse.
              Nos comunicaremos con vos para informarte el valor,
              la disponibilidad y las opciones de publicación.
            </div>

            <button
              type="submit"
              style={{
                border: 0,
                borderRadius: 12,
                background: '#6d28d9',
                color: '#ffffff',
                padding: '15px 18px',
                fontWeight: 900,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              Solicitar publicidad
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  display: 'grid',
  gap: 7,
  fontSize: 14,
  fontWeight: 800,
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  border: '1px solid #d8ccf5',
  borderRadius: 10,
  padding: '12px 13px',
  background: '#ffffff',
  color: '#1f1633',
  fontSize: 14,
};
