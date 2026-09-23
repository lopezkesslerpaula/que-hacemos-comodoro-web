import Link from 'next/link';

export default function AdminPublicidadesPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '32px 20px 60px',
        color: '#1f1633',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Link
          href="/admin"
          style={{
            color: '#6d28d9',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ← Volver al panel
        </Link>

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              display: 'inline-block',
              background: '#eee7ff',
              color: '#6d28d9',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 900,
            }}
          >
            ADMINISTRACIÓN
          </span>

          <h1 style={{ margin: '10px 0 6px', fontSize: 32 }}>
            Solicitudes de publicidad
          </h1>

          <p style={{ margin: 0, color: '#6b6475', lineHeight: 1.6 }}>
            Revisá las solicitudes de los comercios y administrá su publicación.
          </p>
        </div>
      </div>
    </main>
  );
}
