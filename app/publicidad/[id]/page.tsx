import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import PaymentOptions from './PaymentOptions';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function PublicidadEstadoPage({
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

  const quoteReady =
    request.status === 'QUOTE_SENT' &&
    request.home_price != null &&
    request.popup_price != null;
  const paymentPaid = request.payment_status === 'PAID';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#faf8ff',
        padding: '32px 20px 60px',
        color: '#1f1633',
      }}
    >
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link
          href="/publicite-aqui"
          style={{
            color: '#6d28d9',
            textDecoration: 'none',
            fontWeight: 800,
          }}
        >
          ← Volver
        </Link>

        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#ede9fe',
              color: '#6d28d9',
              padding: '5px 9px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            PUBLICIDAD
          </div>

          <h1 style={{ margin: '10px 0 6px' }}>
            Estado de tu solicitud
          </h1>

          <p style={{ margin: 0, color: '#6b6475' }}>
            {request.business_name}
          </p>
        </div>

        <section
          style={{
            background: '#ffffff',
            border: '1px solid #ddd5eb',
            borderRadius: 14,
            padding: 22,
          }}
        >
   {paymentPaid ? (
  <div>
    <h2 style={{ marginTop: 0 }}>Pago acreditado</h2>
    <p style={{ lineHeight: 1.6, marginBottom: 0 }}>
      Tu pago fue recibido correctamente. Tu publicidad ya está confirmada.
    </p>
  
          <Link
  href={`/publicidad/${request.id}/crear`}
  style={{
    display: "inline-block",
    marginTop: 18,
    background: "#6d28d9",
    color: "#ffffff",
    padding: "12px 18px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
  }}
>
  Crear mi publicidad
</Link>
    </div>
) : !quoteReady ? (
  <div>
    <h2 style={{ marginTop: 0 }}>Solicitud recibida</h2>
    <p style={{ lineHeight: 1.6, marginBottom: 0 }}>
      Estamos revisando tu solicitud. Cuando el presupuesto esté
      disponible, vas a poder elegir el tipo de publicidad desde
      esta misma pantalla.
    </p>
  </div>
) : (
  <div>
    <h2 style={{ marginTop: 0 }}>Elegí tu publicidad</h2>

    <p style={{ lineHeight: 1.6 }}>
      Tu presupuesto ya está disponible. Elegí una de las dos
      opciones para continuar con el pago.
    </p>

    <PaymentOptions
      requestId={request.id}
      homePrice={Number(request.home_price)}
      popupPrice={Number(request.popup_price)}
    />
  </div>
)}
          
        </section>
      </div>
    </main>
  );
}
