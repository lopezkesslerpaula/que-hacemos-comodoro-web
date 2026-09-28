import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requestId = String(body.requestId || '');
    const adType = String(body.adType || '');
    

    if (!requestId) {
      return Response.json(
        { error: 'Falta identificar la solicitud.' },
        { status: 400 }
      );
    }

    if (adType !== 'HOME' && adType !== 'POPUP') {
      return Response.json(
        { error: 'Tipo de publicidad no válido.' },
        { status: 400 }
      );
    }

   const { data: advertisingRequest, error: readError } = await supabase
  .from('advertising_requests')
  .select('id, selected_ad_type, price')
  .eq('id', requestId)
  .single();

if (readError || !advertisingRequest) {
  return Response.json(
    { error: 'No se encontró la solicitud.' },
    { status: 404 }
  );
}

if (advertisingRequest.selected_ad_type !== adType) {
  return Response.json(
    { error: 'La opción seleccionada no coincide con la solicitud.' },
    { status: 400 }
  );
}

const amount = Number(advertisingRequest.price);

if (!Number.isFinite(amount) || amount <= 0) {
  return Response.json(
    { error: 'La solicitud no tiene un importe válido.' },
    { status: 400 }
  );
}

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: requestId,
            title:
              adType === 'HOME'
                ? 'Publicidad en pantalla de inicio - 10 días'
                : 'Publicidad emergente - 10 días',
            quantity: 1,
            currency_id: 'ARS',
            unit_price: amount,
          },
        ],
        external_reference: `advertising:${requestId}:${adType}`,
      },
    });

    return Response.json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);

    return Response.json(
      { error: 'No se pudo crear el pago.' },
      { status: 500 }
    );
  }
}
