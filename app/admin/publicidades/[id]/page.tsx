import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
async function sendQuote(formData: FormData) {
  'use server';

  const id = String(formData.get('id'));
  const price = Number(formData.get('price'));

  if (!price || price <= 0) {
    throw new Error('Ingresá un presupuesto válido.');
  }

  const { error } = await supabase
    .from('advertising_requests')
    .update({
      price,
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
export default async function PublicidadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

          <p><strong>Rubro:</strong> {request.category}</p>
          <p><strong>Contacto:</strong> {request.contact_name}</p>
          <p><strong>WhatsApp:</strong> {request.whatsapp}</p>
          <p><strong>Email:</strong> {request.email}</p>
          <p><strong>Instagram o página web:</strong> {request.website_or_instagram || 'No informado'}</p>
          <p><strong>Qué quiere promocionar:</strong> {request.promotion_description}</p>
          <p><strong>Estado:</strong> {request.status}</p>
          <form action={sendQuote} style={{ marginTop: 20 }}>
  <input type="hidden" name="id" value={request.id} />

  <label
    style={{
      display: 'block',
      fontWeight: 800,
      marginBottom: 6,
    }}
  >
    Presupuesto
  </label>

  <input
    type="number"
    name="price"
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
      marginBottom: 12,
    }}
  />

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
        </div>
      </div>
    </main>
  );
}
