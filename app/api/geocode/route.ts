import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Dirección requerida' },
        { status: 400 }
      );
    }

    const query = `${address}, Comodoro Rivadavia, Chubut, Argentina`;

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('countrycodes', 'ar');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'QueHacemosComodoro/1.0',
        'Accept-Language': 'es',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'No se pudo consultar la ubicación' },
        { status: 502 }
      );
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró la dirección' },
        { status: 404 }
      );
    }

    const latitude = Number(results[0].lat);
    const longitude = Number(results[0].lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        { error: 'Coordenadas inválidas' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('Error geocodificando dirección:', error);

    return NextResponse.json(
      { error: 'Error al obtener las coordenadas' },
      { status: 500 }
    );
  }
}
