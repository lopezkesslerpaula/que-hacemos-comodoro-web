import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

function getAdminToken() {
  const password = process.env.ADMIN_ACCESS_PASSWORD;

  if (!password) {
    throw new Error('ADMIN_ACCESS_PASSWORD no está configurada.');
  }

  return createHash('sha256').update(password).digest('hex');
}

async function loginAdmin(formData: FormData) {
  'use server';

  const password = String(formData.get('password') ?? '');
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD;

  if (!expectedPassword || password !== expectedPassword) {
    redirect('/admin?error=1');
  }

  const cookieStore = await cookies();

  cookieStore.set('qhc_admin_session', getAdminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  redirect('/admin');
}

async function logoutAdmin() {
  'use server';

  const cookieStore = await cookies();
  cookieStore.delete('qhc_admin_session');

  redirect('/admin');
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const authenticated =
    cookieStore.get('qhc_admin_session')?.value === getAdminToken();

  if (authenticated) {
    return (
      <main
        style={{
          minHeight: '100vh',
          background: '#faf8ff',
          padding: '40px 20px',
          color: '#201733',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div>
              <span
                style={{
                  color: '#6f32e8',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                ADMINISTRACIÓN
              </span>

              <h1 style={{ margin: '8px 0 0', fontSize: 38 }}>
                Qué Hacemos Comodoro
              </h1>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                style={{
                  border: '1px solid #ddd5eb',
                  background: '#fff',
                  padding: '11px 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <section
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 30,
              boxShadow: '0 16px 45px rgba(70, 42, 120, 0.08)',
            }}
          >
            <div style={{ fontSize: 42, marginBottom: 12 }}>📋</div>

            <h2 style={{ margin: '0 0 10px' }}>
              Eventos pendientes
            </h2>

            <p
              style={{
                margin: 0,
                color: '#6f657f',
                lineHeight: 1.6,
              }}
            >
              Acceso de administradora correcto. En el siguiente paso
              conectaremos acá los eventos PENDING_REVIEW guardados en
              Supabase.
            </p>
          </section>
        </div>
      </main>
    );
  }

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
          maxWidth: 430,
          background: '#fff',
          borderRadius: 22,
          padding: 34,
          boxShadow: '0 18px 50px rgba(70, 42, 120, 0.10)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: '#6f32e8',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 22,
            marginBottom: 22,
          }}
        >
          Q
        </div>

        <span
          style={{
            color: '#6f32e8',
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          ACCESO ADMINISTRADORA
        </span>

        <h1
          style={{
            fontSize: 32,
            margin: '8px 0 10px',
          }}
        >
          Ingresar al panel
        </h1>

        <p
          style={{
            color: '#6f657f',
            lineHeight: 1.5,
            marginBottom: 26,
          }}
        >
          Ingresá tu contraseña para revisar y administrar los eventos.
        </p>

        {params.error === '1' && (
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
            Contraseña incorrecta.
          </div>
        )}

        <form action={loginAdmin}>
          <label>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 7,
              }}
            >
              Contraseña
            </div>

            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Ingresá tu contraseña"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #ddd5eb',
                borderRadius: 12,
                padding: '14px',
                fontSize: 15,
                marginBottom: 18,
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: '100%',
              border: 0,
              borderRadius: 12,
              background: '#6f32e8',
              color: '#fff',
              padding: '15px',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </main>
  );
}
