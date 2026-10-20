import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
async function verificarAdmin() {
  const password = process.env.ADMIN_ACCESS_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_ACCESS_PASSWORD no está configurada.");
  }

  const token = createHash("sha256")
    .update(password)
    .digest("hex");

  const cookieStore = await cookies();

  return cookieStore.get("qhc_admin_session")?.value === token;
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
async function sendQuote(formData: FormData) {
  'use server';
    if (!(await verificarAdmin())) {
    throw new Error("No tenés autorización para enviar presupuestos.");
  }

  const id = String(formData.get('id'));
 const homePrice = Number(formData.get('home_price'));
const popupPrice = Number(formData.get('popup_price'));

if (!homePrice || homePrice <= 0 || !popupPrice || popupPrice <= 0) {
  throw new Error('Ingresá valores válidos para las dos opciones.');
}
  const { error } = await supabase
    .from('advertising_requests')
    .update({
      home_price: homePrice,
popup_price: popupPrice,
      status: 'QUOTE_SENT',
      payment_status: 'NOT_REQUESTED',
    })
    .eq('id', id);

  if (error) {
    throw new Error('No se pudo enviar el presupuesto.');
  }

  revalidatePath(`/admin/publicidades/${id}`);
  revalidatePath('/admin/publicidades');
}


async function aprobarPublicidad(formData: FormData) {
  "use server";

  if (!(await verificarAdmin())) {
    throw new Error("No tenés autorización para aprobar publicidades.");
  }

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Falta identificar la publicidad.");
  }

  const { data, error } = await supabase
    .from("advertising_requests")
    .update({
      ad_status: "APPROVED",
    })
    .eq("id", id)
    .eq("ad_status", "SUBMITTED")
    .eq("payment_status", "PAID")
    .select("id");

  if (error) {
    throw new Error("No se pudo aprobar la publicidad.");
  }

  if (!data || data.length === 0) {
    throw new Error("La publicidad debe estar enviada y pagada para aprobarse.");
  }

  revalidatePath(`/admin/publicidades/${id}`);
  revalidatePath("/admin/publicidades");
}

export default async function PublicidadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    if (!(await verificarAdmin())) {
    redirect("/admin");
  }
  const { id } = await params;

  const { data: request, error } = await supabase
    .from('advertising_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !request) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '32px 20px 60px',
        color: '#1f1633',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/admin/publicidades"
          style={{
            color: '#6d28d9',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 14,
          }}
        >
          ← Volver a solicitudes
        </Link>

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              display: 'inline-block',
              background: '#eee5ff',
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
            Detalle de solicitud
          </h1>

          <p style={{ margin: 0, color: '#6b6475' }}>
            Revisá los datos enviados por el comercio.
          </p>
        </div>

        <div
          style={{
            marginTop: 24,
            background: '#ffffff',
            border: '1px solid #ddd5eb',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>{request.business_name}</h2>
          {request.ad_title && (
  <p style={{ marginTop: 8 }}>
    <strong>Título de la publicidad:</strong> {request.ad_title}
  </p>
)}

          <p><strong>Rubro:</strong> {request.category}</p>
          <p><strong>Contacto:</strong> {request.contact_name}</p>
          <p><strong>WhatsApp:</strong> {request.whatsapp}</p>
          <p><strong>Email:</strong> {request.email}</p>
          <p><strong>Instagram o página web:</strong> {request.website_or_instagram || 'No informado'}</p>
          <p><strong>Qué quiere promocionar:</strong> {request.promotion_description}</p>
          {request.image_url && (
  <div style={{ marginTop: 16, marginBottom: 16 }}>
    <p><strong>Imagen de la publicidad:</strong></p>
    <img
      src={request.image_url}
      alt="Imagen de la publicidad"
      style={{
        width: "100%",
        maxWidth: 400,
        height: "auto",
        borderRadius: 12,
      }}
    />
  </div>
)}
          <p><strong>Estado:</strong> {request.status}</p>

          {request.status === "PENDING" &&
  request.payment_status === "NOT_REQUESTED" && (
          <form action={sendQuote} style={{ marginTop: 20 }}>
  <input type="hidden" name="id" value={request.id} />

 <label
  style={{
    display: 'block',
    fontWeight: 800,
    marginBottom: 6,
  }}
>
  Precio publicidad en pantalla de inicio
</label>

<input
  type="number"
  name="home_price"
  min="1"
  required
  placeholder="Ej. 20000"
  style={{
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ddd5eb',
    borderRadius: 10,
    padding: '12px',
    fontSize: 14,
    marginBottom: 16,
  }}
/>

<label
  style={{
    display: 'block',
    fontWeight: 800,
    marginBottom: 6,
  }}
>
  Precio publicidad emergente
</label>

<input
  type="number"
  name="popup_price"
  min="1"
  required
  placeholder="Ej. 35000"
  style={{
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #ddd5eb',
    borderRadius: 10,
    padding: '12px',
    fontSize: 14,
    marginBottom: 12,
  }}
/>
<p
  style={{
    margin: '0 0 14px',
    color: '#6b6475',
    fontSize: 13,
    fontWeight: 700,
  }}
>
  Duración de la publicidad: 10 días
</p>
  <button
    type="submit"
    style={{
      border: 0,
      borderRadius: 10,
      background: '#6d28d9',
      color: '#ffffff',
      padding: '12px 18px',
      fontWeight: 800,
      fontSize: 14,
      cursor: 'pointer',
    }}
  >
    Enviar presupuesto
  </button>
</form>
)}
          
{request.ad_status === "SUBMITTED" &&
  request.payment_status === "PAID" && (
    <form action={aprobarPublicidad} style={{ marginTop: 16 }}>
      <input type="hidden" name="id" value={request.id} />
      <button
        type="submit"
        style={{
          border: 0,
          borderRadius: 10,
          background: "#16a34a",
          color: "#ffffff",
          padding: "12px 18px",
          fontWeight: 800,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        Aprobar publicidad
      </button>
    </form>
  )}

        </div>
      </div>
    </main>
  );
}
