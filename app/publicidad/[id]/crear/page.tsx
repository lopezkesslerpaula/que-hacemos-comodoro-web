export default function CrearPublicidadPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#faf8ff",
        padding: "32px 20px 60px",
        color: "#1f1633",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            display: "inline-block",
            background: "#ede9fe",
            color: "#6d28d9",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          PUBLICIDAD
        </div>

        <h1 style={{ marginBottom: 8 }}>Creá tu publicidad</h1>

        <p style={{ color: "#6b6475", lineHeight: 1.6 }}>
          Completá los datos y prepará la publicidad que querés mostrar en Qué
          Hacemos Comodoro.
        </p>
      </div>
    </main>
  );
}
