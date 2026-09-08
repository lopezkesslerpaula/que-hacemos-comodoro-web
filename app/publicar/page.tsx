'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default function PublicarEventoPage() {
const [tipoEntrada, setTipoEntrada] = useState('');
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const { error } = await supabase.from('events').insert({
   title: form.get('titulo'),
    category: form.get('categoria'),
    event_date: form.get('fecha'),
    event_time: form.get('hora'),
    place: form.get('lugar'),
    address: form.get('direccion'),
    entry_type: form.get('entrada'),
    price: form.get('precio') || null,
    description: form.get('descripcion'),
    status: 'PENDING_REVIEW'
  });

  if (error) {
    console.error(error);
    alert('No pudimos enviar el evento. Intentá nuevamente.');
    return;
  }

  setEnviado(true);
}
if (enviado) {
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
          maxWidth: 560,
          margin: '80px auto',
          background: '#fff',
          padding: 40,
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 54, marginBottom: 16 }}>✅</div>

        <div
          style={{
            display: 'inline-block',
            background: '#efe7ff',
            color: '#6f32e8',
            fontWeight: 800,
            fontSize: 12,
            padding: '7px 12px',
            borderRadius: 999,
            marginBottom: 16,
          }}
        >
          PENDIENTE DE APROBACIÓN
        </div>

        <h1 style={{ fontSize: 32, margin: '0 0 12px' }}>
          ¡Evento enviado!
        </h1>

        <p
          style={{
            lineHeight: 1.6,
            color: '#655b75',
            marginBottom: 28,
          }}
        >
          Recibimos tu evento correctamente. Será revisado antes de
          publicarse en Qué Hacemos Comodoro.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#6f32e8',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 800,
            padding: '14px 24px',
            borderRadius: 12,
          }}
        >
          Volver al inicio
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
        padding: '40px 20px 80px',
        color: '#201733',
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginBottom: 28,
            color: '#6f32e8',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          ← Volver al inicio
        </Link>

        <div
          style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: 32,
            boxShadow: '0 18px 50px rgba(70, 42, 120, 0.08)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              background: '#efe7ff',
              color: '#6f32e8',
              borderRadius: 999,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            PARA ORGANIZADORES
          </span>

          <h1
            style={{
              fontSize: 42,
              lineHeight: 1.05,
              margin: '0 0 12px',
            }}
          >
            Publicá tu evento
          </h1>

          <p
            style={{
              margin: '0 0 30px',
              fontSize: 17,
              lineHeight: 1.6,
              color: '#6f657f',
            }}
          >
            Completá los datos principales. Más adelante conectaremos este
            formulario con la base de datos y el sistema de aprobación.
          </p>

          {enviado ? (
            <div
              style={{
                background: '#f2ecff',
                border: '1px solid #d9c7ff',
                borderRadius: 18,
                padding: 24,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Evento recibido ✅</h2>
              <p style={{ marginBottom: 0, color: '#5f5570' }}>
                Esta es una prueba del flujo. Todavía no guardamos los datos en
                Supabase.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gap: 18,
                }}
              >
                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Nombre del evento
                  </div>
                  <input
                    required
                    name="titulo"
                    placeholder="Ej. Festival de música en vivo"
                    style={inputStyle}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Categoría
                  </div>
                  <select required name="categoria" style={inputStyle}>
                    <option value="">Seleccionar categoría</option>
                    <option>Música</option>
                    <option>Cultura</option>
                    <option>Deportes</option>
                    <option>Ferias</option>
                    <option>Gastronomía</option>
                    <option>Arte</option>
                    <option>Familia</option>
                    <option>Fiestas</option>
                    <option>Educación</option>
                    <option>Comunidad</option>
                  </select>
                </label>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 18,
                  }}
                >
                  <label>
                    <div style={{ fontWeight: 700, marginBottom: 7 }}>Fecha</div>
                    <input required type="date" name="fecha" style={inputStyle} />
                  </label>

                  <label>
                    <div style={{ fontWeight: 700, marginBottom: 7 }}>Hora</div>
                    <input required type="time" name="hora" style={inputStyle} />
                  </label>
                </div>

                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>Lugar</div>
                  <input
                    required
                    name="lugar"
                    placeholder="Ej. Centro Cultural"
                    style={inputStyle}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Dirección
                  </div>
                  <input
                    required
                    name="direccion"
                    placeholder="Ej. Av. Hipólito Yrigoyen 1234"
                    style={inputStyle}
                  />
                </label>

                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Tipo de entrada
                  </div>
<select
  required
  name="entrada"
  style={inputStyle}
  value={tipoEntrada}
  onChange={(e) => setTipoEntrada(e.target.value)}
>
                    <option value="">Seleccionar</option>
                    <option>Gratis</option>
                    <option>Paga</option>
                    <option>Consultar</option>
                  </select>
                  {tipoEntrada === 'Paga' && (
  <input
    required
    type="number"
    name="precio"
    min="0"
    placeholder="Precio de la entrada ($)"
    style={{ ...inputStyle, marginTop: 10 }}
  />
)}
                </label>

                <label>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Descripción
                  </div>
                  <textarea
                    required
                    name="descripcion"
                    rows={5}
                    placeholder="Contanos de qué se trata el evento..."
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                    }}
                  />
                </label>
<label>
  <div style={{ fontWeight: 700, marginBottom: 7 }}>
    Imagen de portada
  </div>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const archivo = e.target.files?.[0];

      if (archivo) {
        setImagenPreview(URL.createObjectURL(archivo));
      }
    }}
    style={{
      ...inputStyle,
      padding: 10,
      background: '#fff',
    }}
  />

  {imagenPreview && (
    <img
      src={imagenPreview}
      alt="Vista previa del evento"
      style={{
        width: '100%',
        height: 220,
        objectFit: 'cover',
        borderRadius: 14,
        marginTop: 12,
      }}
    />
  )}
</label>
                <button
                  type="submit"
                  style={{
                    marginTop: 8,
                    border: 0,
                    borderRadius: 14,
                    background: '#6f32e8',
                    color: '#fff',
                    padding: '16px 22px',
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Enviar evento
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #ddd5eb',
  borderRadius: 12,
  padding: '13px 14px',
  fontSize: 15,
  outline: 'none',
  background: '#fff',
  color: '#201733',
};
