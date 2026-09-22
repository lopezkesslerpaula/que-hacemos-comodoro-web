'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function ActualizarPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(
        'No pudimos actualizar la contraseña. Volvé a solicitar un enlace de recuperación.'
      );
      setLoading(false);
      return;
    }

    setMessage('Tu contraseña fue actualizada correctamente.');
    setPassword('');
    setConfirmPassword('');
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
            NUEVA CONTRASEÑA
          </div>

          <h1
            style={{
              margin: '0 0 8px',
              fontSize: 28,
            }}
          >
            Creá una nueva contraseña
          </h1>

          <p
            style={{
              margin: '0 0 24px',
              color: '#6f657f',
              lineHeight: 1.5,
            }}
          >
            Ingresá tu nueva contraseña dos veces para confirmar el cambio.
          </p>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Nueva contraseña
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

            <label
              htmlFor="confirmPassword"
              style={{
                display: 'block',
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Repetir nueva contraseña
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
