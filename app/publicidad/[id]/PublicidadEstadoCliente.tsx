
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import PaymentOptions from './PaymentOptions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Solicitud = {
  id: number;
  business_name: string;
  status: string;
  payment_status: string | null;
  ad_status: string | null;
  home_price: number | null;
  popup_price: number | null;
};

export default function PublicidadEstadoCliente({
  id,
}: {
  id: string;
}) {
  const [request, setRequest] = useState<Solicitud | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function cargarSolicitud() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setErrorMessage('Iniciá sesión para ver tu solicitud.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc(
        'mi_solicitud_publicidad',
        { solicitud_id: Number(id) }
      );

      if (error || !data?.length) {
        setErrorMessage('No se pudo encontrar tu solicitud.');
      } else {
        setRequest(data[0]);
      }

      setLoading(false);
    }

    cargarSolicitud();
  }, [id]);

  const contenedor = {
    minHeight: '100vh',
    background: '#faf8ff',
    padding: '32px 20px',
    color: '#1f1633',
  };

  if (loading) {
    return <main style={contenedor}>Cargando solicitud...</main>;
  }

  if (errorMessage || !request) {
    return (
      <main style={contenedor}>
        <p>{errorMessage || 'Solicitud no disponible.'}</p>
        <Link href="/mis-publicidades">Volver a mis publicidades</Link>
      </main>
    );
  }

  const quoteReady =
    request.status === 'QUOTE_SENT' &&
    request.home_price != null &&
    request.popup_price != null;

  const paymentPaid = request.payment_status === 'PAID';
  const adStatus = request.ad_status;

  return (
    <main style={contenedor}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <Link href="/mis-publicidades">← Volver</Link>

        <h1>Estado de tu solicitud</h1>
        <p>{request.business_name}</p>

        <section
          style={{
            background: '#ffffff',
            border: '1px solid #ddd5eb',
            borderRadius: 14,
            padding: 22,
            marginTop: 20,
          }}
        >
          {paymentPaid ? (
            <div>
              <h2>Pago acreditado</h2>
              <p>Tu pago fue recibido correctamente.</p>

              {(adStatus === 'DRAFT' || !adStatus) && (
                <Link href={`/publicidad/${request.id}/crear`}>
                  Crear mi publicidad
                </Link>
              )}

              {adStatus === 'SUBMITTED' && (
                <p style={{ color: '#6d28d9', fontWeight: 700 }}>
                  Tu publicidad está en revisión.
                </p>
              )}

              {adStatus === 'APPROVED' && (
                <p style={{ color: '#15803d', fontWeight: 700 }}>
                  Publicidad aprobada. Tu anuncio ya está listo para mostrarse.
                </p>
              )}
            </div>
          ) : !quoteReady ? (
            <div>
              <h2>Solicitud recibida</h2>
              <p>
                Estamos revisando tu solicitud. Cuando el presupuesto esté
                disponible, vas a poder elegir el tipo de publicidad.
              </p>
            </div>
          ) : (
            <div>
              <h2>Elegí tu publicidad</h2>
              <p>Tu presupuesto ya está disponible.</p>
              <PaymentOptions
                requestId={String(request.id)}
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
