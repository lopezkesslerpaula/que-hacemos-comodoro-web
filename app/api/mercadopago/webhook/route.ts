import { NextResponse } from 'next/server';
import {
  WebhookSignatureValidator,
  InvalidWebhookSignatureError,
} from 'mercadopago';

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
