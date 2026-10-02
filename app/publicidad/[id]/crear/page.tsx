"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
export default function CrearPublicidadPage() {
    const [title, setTitle] = useState("");
    const params = useParams();
  const requestId = Number(params.id);
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  
      const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    setSending(true);
    setMessage("");

    const { data, error } = await supabase
      .from("advertising_requests")
      .update({
        ad_title: title,
        promotion_description: description,
        whatsapp: whatsapp,
        website_or_instagram: website,
        ad_status: "SUBMITTED",
      })
      .eq("id", requestId);
      .select();
if (!data || data.length === 0) {
  setMessage("No se encontró la solicitud para actualizar.");
  setSending(false);
  return;
}
    if (error) {
      console.error(error);
      setMessage("No se pudo enviar la publicidad. Intentá nuevamente.");
      setSending(false);
      return;
    }

    setMessage("Publicidad enviada para revisión.");
    setSending(false);
  }
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
      value={title}
onChange={(e) => setTitle(e.target.value)}
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
      value={description}
onChange={(e) => setDescription(e.target.value)}
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
    
      value={whatsapp}
onChange={(e) => setWhatsapp(e.target.value)}
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
      value={website}
onChange={(e) => setWebsite(e.target.value)}
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
    onClick={handleSubmit}
disabled={sending}
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
    {sending ? "Enviando..." : "Enviar publicidad para revisión"}
  </button>
          {message && (
  <p style={{ marginTop: 14, fontWeight: 700 }}>
    {message}
  </p>
)}
</div>
      </div>
    </main>
  );
}
