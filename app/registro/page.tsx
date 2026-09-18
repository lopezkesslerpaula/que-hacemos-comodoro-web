'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function RegistroPage() {
  const [enviado, setEnviado] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const nombre = String(formData.get('nombre') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          tipo_usuario: 'ORGANIZER',
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setEnviado(true);
    setLoading(false);
  }

  if (enviado) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#faf8ff',
          display: 'grid',
          placeItems: 'center',
          padding: 20,
          color: '#201733',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            background: '#fff',
            padding: 36,
            borderRadius: 22,
            textAlign: 'center',
            boxShadow: '0 18px 50px rgba(70, 42, 120, 0.10)',
          }}
        >
          <div style={{ fontSize: 50, marginBottom: 16 }}>📩</div>

          <span
            style={{
              display: 'inline-block',
              background: '#eee5ff',
              color: '#6f32e8',
              padding: '6px 10px',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 11,
              marginBottom: 16,
            }}
          >
            CUENTA CREADA
          </span>

          <h1 style={{ margin: '0 0 12px', fontSize: 30 }}>
            Revisá tu correo
          </h1>

          <p
            style={{
              color: '#6f657f',
              lineHeight: 1.6,
              marginBottom: 26,
            }}
          >
            Te enviamos un email para confirmar tu cuenta de organizador.
            Después de confirmarla vas a poder iniciar sesión.
          </p>

          <Link
            href="/login"
            style={{
              display: 'inline-block',
              background: '#6f32e8',
              color: '#fff',
              textDecoration: 'none',
              padding: '13px 20px',
              borderRadius: 12,
              fontWeight: 800,
            }}
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </main>
    );
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
            PARA ORGANIZADORES
          </span>

          <h1
            style={{
              fontSize: 32,
              margin: '8px 0 10px',
            }}
          >
            Crear cuenta
          </h1>

          <p
            style={{
              color: '#6f657f',
              lineHeight: 1.5,
              marginBottom: 26,
            }}
          >
            Registrate para publicar y administrar tus eventos.
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
              <div style={{ fontWeight: 700, marginBottom: 7 }}>
                Nombre
              </div>

              <input
                required
                name="nombre"
                type="text"
                placeholder="Tu nombre o nombre del organizador"
                style={inputStyle}
              />
            </label>

            <label>
              <div style={{ fontWeight: 700, margin: '16px 0 7px' }}>
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
              <div style={{ fontWeight: 700, margin: '16px 0 7px' }}>
                Contraseña
              </div>

              <input
                required
                name="password"
                type="password"
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
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
                padding: '15px',
                marginTop: 22,
                fontWeight: 800,
                fontSize: 15,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
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
            ¿Ya tenés una cuenta?{' '}
            <span style={{ color: '#6f32e8', fontWeight: 800 }}>
              Próximamente: Iniciar sesión
            </span>
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
