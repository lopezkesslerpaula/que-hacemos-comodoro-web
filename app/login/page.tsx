'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
const params = new URLSearchParams(window.location.search);
const destination =
  next === '/publicar' ? '/publicar' : '/mis-eventos';
const destination = next === '/publicar' ? '/publicar' : '/';
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        'No pudimos iniciar sesión. Revisá tu email y contraseña.'
      );
      setLoading(false);
      return;
    }
window.location.href = destination;
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
          href="/"
          style={{
            color: '#6f32e8',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          ← Volver al inicio
        </Link>

        <div
          style={{
            marginTop: 24,
            background: '#fff',
            borderRadius: 22,
            padding: 34,
            boxShadow: '0 18px 50px rgba(70, 42, 120, 0.10)',
          }}
        >
          <span
            style={{
              color: '#6f32e8',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            ORGANIZADORES
          </span>

          <h1
            style={{
              fontSize: 32,
              margin: '8px 0 10px',
            }}
          >
            Iniciar sesión
          </h1>

          <p
            style={{
              color: '#6f657f',
              lineHeight: 1.5,
              marginBottom: 26,
            }}
          >
            Ingresá para publicar y administrar tus eventos.
          </p>

          {errorMessage && (
            <div
              style={{
                background: '#fff0f2',
                color: '#a4283a',
                padding: 12,
                borderRadius: 10,
                marginBottom: 18,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 7,
                }}
              >
                Email
              </div>

              <input
                required
                name="email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                style={inputStyle}
              />
            </label>

            <label>
              <div
                style={{
                  fontWeight: 700,
                  margin: '16px 0 7px',
                }}
              >
                Contraseña
              </div>

              <input
                required
                name="password"
                type="password"
                placeholder="Tu contraseña"
                autoComplete="current-password"
                style={inputStyle}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 12,
                background: '#6f32e8',
                color: '#fff',
                padding: 15,
                marginTop: 22,
                fontWeight: 800,
                fontSize: 15,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              color: '#6f657f',
              margin: '22px 0 0',
              fontSize: 14,
            }}
          >
            ¿Todavía no tenés una cuenta?{' '}
            <Link
              href="/registro"
              style={{
                color: '#6f32e8',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  border: '1px solid #ddd5eb',
  borderRadius: 12,
  padding: '13px 14px',
  fontSize: 15,
  color: '#201733',
  background: '#fff',
};
