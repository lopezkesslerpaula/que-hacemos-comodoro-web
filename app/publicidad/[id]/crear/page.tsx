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
        <div
  style={{
    marginTop: 28,
    background: "#ffffff",
    border: "1px solid #ddd5eb",
    borderRadius: 14,
    padding: 22,
  }}
>
  <h2 style={{ marginTop: 0 }}>Contenido de tu publicidad</h2>

  <div style={{ marginTop: 18 }}>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
      Título de la publicidad
    </label>
    <input
      type="text"
      placeholder="Ej: Clases de pilates"
      style={{
        width: "100%",
        padding: 12,
        border: "1px solid #ccc4d8",
        borderRadius: 8,
        boxSizing: "border-box",
      }}
    />
  </div>

  <div style={{ marginTop: 18 }}>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
      Texto de la publicidad
    </label>
    <textarea
      rows={5}
      placeholder="Contanos qué querés promocionar"
      style={{
        width: "100%",
        padding: 12,
        border: "1px solid #ccc4d8",
        borderRadius: 8,
        boxSizing: "border-box",
        resize: "vertical",
      }}
    />
  </div>

  <div style={{ marginTop: 18 }}>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
      Imagen de la publicidad
    </label>
    <input type="file" accept="image/*" />
  </div>

  <div style={{ marginTop: 18 }}>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
      WhatsApp o teléfono
    </label>
    <input
      type="text"
      placeholder="Ej: 297 4000000"
      style={{
        width: "100%",
        padding: 12,
        border: "1px solid #ccc4d8",
        borderRadius: 8,
        boxSizing: "border-box",
      }}
    />
  </div>

  <div style={{ marginTop: 18 }}>
    <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>
      Instagram o sitio web
    </label>
    <input
      type="text"
      placeholder="Ej: @mi_comercio"
      style={{
        width: "100%",
        padding: 12,
        border: "1px solid #ccc4d8",
        borderRadius: 8,
        boxSizing: "border-box",
      }}
    />
  </div>

  <button
    type="button"
    style={{
      marginTop: 24,
      background: "#6d28d9",
      color: "#ffffff",
      border: "none",
      borderRadius: 10,
      padding: "12px 18px",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Enviar publicidad para revisión
  </button>
</div>
      </div>
    </main>
  );
}
