import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requestId = body.requestId;
    const adType = body.adType;

    if (!requestId || (adType !== 'HOME' && adType !== 'POPUP')) {
      return NextResponse.json(
        { error: 'Datos inválidos.' },
        { status: 400 }
      );
    }

    const { data: advertisingRequest, error: readError } = await supabase
      .from('advertising_requests')
      .select('id, home_price, popup_price')
      .eq('id', requestId)
      .single();

    if (readError || !advertisingRequest) {
      return NextResponse.json(
        { error: 'No se encontró la solicitud.' },
        { status: 404 }
      );
    }

    const price =
      adType === 'HOME'
        ? advertisingRequest.home_price
        : advertisingRequest.popup_price;

    if (price === null || price === undefined) {
      return NextResponse.json(
        { error: 'El presupuesto todavía no está disponible.' },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from('advertising_requests')
      .update({
        selected_ad_type: adType,
        price: Number(price),
      })
      .eq('id', requestId);

    if (updateError) {
      console.error(updateError);

      return NextResponse.json(
        { error: 'No se pudo guardar la opción.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      selected_ad_type: adType,
      price: Number(price),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
