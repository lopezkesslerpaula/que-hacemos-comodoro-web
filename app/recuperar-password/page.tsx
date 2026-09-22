'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage('Ingresá tu email.');
      return;
    }

    setLoading(true);
    setMessage('');
    setErrorMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/actualizar-password`,
    });

    if (error) {
      setErrorMessage(
        'No pudimos enviar el correo de recuperación. Intentá nuevamente.'
      );
      setLoading(false);
      return;
    }

    setMessage(
      'Te enviamos un correo para recuperar tu contraseña. Revisá también la carpeta de spam.'
    );
    setLoading(false);
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
          maxWidth: 520,
          margin: '0 auto',
        }}
      >
        <Link
          href="/login"
          style={{
            color: '#6f32e8',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          ← Volver a iniciar sesión
        </Link>

        <div
          style={{
            marginTop: 24,
            background: '#fff',
            borderRadius: 18,
            padding: 28,
          }}
        >
          <div
            style={{
              color: '#6f32e8',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            RECUPERAR CONTRASEÑA
          </div>

          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 28,
            }}
          >
            ¿Olvidaste tu contraseña?
          </h1>

          <p
            style={{
              margin: '0 0 24px',
              color: '#6f657f',
              lineHeight: 1.5,
            }}
          >
            Ingresá el email de tu cuenta y te enviaremos un enlace para crear
            una contraseña nueva.
          </p>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tuemail@ejemplo.com"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #ddd5eb',
                borderRadius: 10,
                padding: '13px 14px',
                fontSize: 15,
                marginBottom: 16,
              }}
            />

            {errorMessage && (
              <div
                style={{
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 10,
                  padding: 12,
                  color: '#a8283a',
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {errorMessage}
              </div>
            )}

            {message && (
              <div
                style={{
                  background: '#ecfdf3',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: 12,
                  color: '#137333',
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 10,
                background: '#6f32e8',
                color: '#fff',
                padding: '13px 18px',
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
