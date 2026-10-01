import { NextResponse } from 'next/server';
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from 'mercadopago';

import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const paymentClient = new Payment(mercadoPagoClient);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (!secret) {
      console.error('Falta MERCADOPAGO_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Webhook no configurado.' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const dataId = url.searchParams.get('data.id') || '';
    const xSignature = request.headers.get('x-signature') || '';
    const xRequestId = request.headers.get('x-request-id') || '';

    WebhookSignatureValidator.validate({
      xSignature,
      xRequestId,
      dataId,
      secret,
    });

    if (!dataId) {
  return NextResponse.json({ ok: true });
}

const payment = await paymentClient.get({
  id: Number(dataId),
});

if (payment.status !== 'approved') {
  return NextResponse.json({ ok: true });
}

const externalReference = payment.external_reference || '';
    console.log('WEBHOOK external_reference:', externalReference);

if (!externalReference.startsWith('advertising:')) {
  return NextResponse.json({ ok: true });
}

const [, requestId] = externalReference.split(':');

if (!requestId) {
  return NextResponse.json({ ok: true });
}

const { error: updateError } = await supabase
  .from('advertising_requests')
  .update({
    payment_status: 'PAID',
  })
  .eq('id', requestId);

if (updateError) {
  console.error('Error actualizando pago de publicidad:', updateError);
  throw updateError;
}

return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      return NextResponse.json(
        { error: 'Firma inválida.' },
        { status: 401 }
      );
    }

    console.error('Error procesando webhook:', error);

    return NextResponse.json(
      { error: 'Error procesando webhook.' },
      { status: 500 }
    );
  }
}
