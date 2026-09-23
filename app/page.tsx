'use client';
// GitHub conectado con Vercel
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  place: string;
  price: string;
  coverImageUrl?: string | null;
  emoji: string;
  featured?: boolean;
  latitude?: number | null;
longitude?: number | null;
};
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
const categories = [
  ['🎵', 'Música'],
  ['🎭', 'Cultura'],
  ['🏃', 'Deportes'],
  ['🛍️', 'Ferias'],
  ['🍽️', 'Gastronomía'],
  ['🎨', 'Arte'],
  ['👨‍👩‍👧‍👦', 'Familia'],
  ['🎉', 'Fiestas'],
  ['📚', 'Educación'],
  ['🤝', 'Comunidad'],
] as const;

const events: EventItem[] = [
  {
    id: '1',
    title: 'Festival de música en vivo',
    category: 'Música',
    date: 'Vie 11 Sep',
    time: '21:00',
    place: 'Centro Cultural',
    price: 'Entrada libre',
    emoji: '🎸',
    featured: true,
  },
  {
    id: '2',
    title: 'Feria de emprendedores',
    category: 'Ferias',
    date: 'Sáb 12 Sep',
    time: '15:00',
    place: 'Costanera',
    price: 'Gratis',
    emoji: '🧺',
  },
  {
    id: '3',
    title: 'Noche de teatro local',
    category: 'Cultura',
    date: 'Sáb 12 Sep',
    time: '20:30',
    place: 'Teatro de la ciudad',
    price: 'Consultar',
    emoji: '🎭',
  },
  {
    id: '4',
    title: 'Encuentro gastronómico',
    category: 'Gastronomía',
    date: 'Dom 13 Sep',
    time: '12:00',
    place: 'Parque Saavedra',
    price: 'Entrada libre',
    emoji: '🍔',
  },
  {
    id: '5',
    title: 'Tarde en familia',
    category: 'Familia',
    date: 'Dom 13 Sep',
    time: '16:00',
    place: 'Plaza Soberanía',
    price: 'Gratis',
    emoji: '🎈',
  },
  {
    id: '6',
    title: 'Taller creativo para jóvenes',
    category: 'Educación',
    date: 'Mar 15 Sep',
    time: '18:00',
    place: 'Espacio Cultural',
    price: 'Cupos limitados',
    emoji: '✏️',
  },
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [favorites, setFavorites] = useState<string[]>([]);
const [publishedEvents, setPublishedEvents] = useState<EventItem[]>([]);
const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [nearbyOnly, setNearbyOnly] = useState(false);
const [userLatitude, setUserLatitude] = useState<number | null>(null);
const [userLongitude, setUserLongitude] = useState<number | null>(null);
  useEffect(() => {
  async function checkSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setIsLoggedIn(Boolean(user));
    setUserId(user?.id ?? null);
  }

  checkSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUserId(session?.user?.id ?? null);
    setIsLoggedIn(Boolean(session?.user));
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);
  useEffect(() => {
  async function loadFavorites() {
    if (!userId) {
      setFavorites([]);
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error cargando favoritos:', error);
      return;
    }

    setFavorites((data ?? []).map((item) => item.event_id));
  }

  loadFavorites();
}, [userId]);
useEffect(() => {
  async function loadPublishedEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error cargando eventos publicados:', error);
      return;
    }

    const mappedEvents: EventItem[] = (data ?? []).map((event, index) => ({
      id: event.id,
      title: event.title,
      category: event.category,
      date: event.event_date,
      time: String(event.event_time).slice(0, 5),
      place: event.place,
      latitude: event.latitude,
longitude: event.longitude,
      coverImageUrl: event.cover_image_url,
      price:
        event.entry_type === 'Paga' && event.price !== null
          ? `$ ${event.price}`
          : event.entry_type === 'Gratis'
            ? 'Gratis'
            : 'Consultar',
      emoji:
        categories.find(([, name]) => name === event.category)?.[0] ?? '📅',
      featured: index === 0,
    }));

    setPublishedEvents(mappedEvents);
  }

  loadPublishedEvents();
}, []);
 const visibleEvents = useMemo(() => {
  const normalized = query.trim().toLocaleLowerCase('es');

  const filteredEvents = publishedEvents.filter((event) => {
    const matchesCategory =
      activeCategory === 'Todos' || event.category === activeCategory;

    const haystack =
      `${event.title} ${event.category} ${event.place}`.toLocaleLowerCase('es');

    const matchesSearch =
      !normalized || haystack.includes(normalized);

    let matchesNearby = true;

    if (
      nearbyOnly &&
      userLatitude !== null &&
      userLongitude !== null
    ) {
      if (event.latitude == null || event.longitude == null) {
        matchesNearby = false;
      } else {
        const toRad = (value: number) => (value * Math.PI) / 180;

        const earthRadiusKm = 6371;
        const dLat = toRad(event.latitude - userLatitude);
        const dLon = toRad(event.longitude - userLongitude);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(userLatitude)) *
            Math.cos(toRad(event.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const distanceKm =
          earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        matchesNearby = distanceKm <= 10;
      }
    }

    return matchesCategory && matchesSearch && matchesNearby;
  });
   if (
  nearbyOnly &&
  userLatitude !== null &&
  userLongitude !== null
) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const getDistance = (event: EventItem) => {
    if (event.latitude == null || event.longitude == null) {
      return Infinity;
    }

    const dLat = toRad(event.latitude - userLatitude);
    const dLon = toRad(event.longitude - userLongitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLatitude)) *
        Math.cos(toRad(event.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    return (
      earthRadiusKm *
      2 *
      Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
  };

  return [...filteredEvents].sort(
    (a, b) => getDistance(a) - getDistance(b)
  );
}

return filteredEvents;
}, [
  query,
  activeCategory,
  publishedEvents,
  nearbyOnly,
  userLatitude,
  userLongitude,
]);

 async function toggleFavorite(id: string) {
  if (!userId) {
    window.location.href = '/login';
    return;
  }

  const eventId = String(id);
  const isFavorite = favorites.includes(id);

  if (isFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error eliminando favorito:', error);
      return;
    }

    setFavorites((current) =>
      current.filter((item) => String(item) !== eventId)
    );
  } else {
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        event_id: eventId,
      });

    if (error) {
  alert(`Error guardando favorito: ${error.message}`);
  return;
}

    setFavorites((current) => [...current, id]);
  }
}
function handleNearbyEvents() {
  if (nearbyOnly) {
    setNearbyOnly(false);
    setUserLatitude(null);
    setUserLongitude(null);
    return;
  }

  if (!navigator.geolocation) {
    alert('Tu navegador no permite obtener tu ubicación.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLatitude(position.coords.latitude);
      setUserLongitude(position.coords.longitude);
      setNearbyOnly(true);
    },
    () => {
      alert(
        'No pudimos obtener tu ubicación. Revisá que hayas permitido el acceso a la ubicación.'
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
}
  function getDistanceText(event: EventItem) {
  if (
    userLatitude === null ||
    userLongitude === null ||
    event.latitude == null ||
    event.longitude == null
  ) {
    return null;
  }

  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(event.latitude - userLatitude);
  const dLon = toRad(event.longitude - userLongitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLatitude)) *
      Math.cos(toRad(event.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const distanceKm =
    earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (distanceKm < 1) {
    return `A ${Math.round(distanceKm * 1000)} m`;
  }

  return `A ${distanceKm.toFixed(1).replace('.', ',')} km`;
}
  async function handleLogout() {
  await supabase.auth.signOut();
  setIsLoggedIn(false);
  window.location.href = '/';
}
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Qué Hacemos Comodoro, inicio">
          <span className="brandMark">Q</span>
          <span>Qué Hacemos <b>Comodoro</b></span>
        </a>
     <nav className="nav" aria-label="Navegación principal">
  <a href="#eventos">Eventos</a>
  <a href="#categorias">Categorías</a>
  <a href="/publicar">Publicar</a>

  {isLoggedIn ? (
    <>
      <a href="/mis-eventos">Mis eventos</a>
      <a href="/perfil-organizador">Mi perfil</a>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          border: 0,
          background: 'transparent',
          padding: 0,
          font: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        Salir
      </button>
    </>
  ) : (
    <a href="/login">Iniciar sesión</a>
  )}

  <a
    href="/favoritos"
    className="navFavorite"
    
    title="Favoritos"
  >
    ♡ Favoritos <span>{favorites.length}</span>
    </a>
  
</nav>
      </header>

      <section className="hero" id="inicio">
        <div className="heroContent">
          <span className="eyebrow">📍 Comodoro Rivadavia</span>
          <h1>Encontrá algo para hacer <span>hoy.</span></h1>
          <p>Eventos, actividades y planes de la ciudad, reunidos en un solo lugar.</p>
          <div className="searchBox" role="search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar recitales, ferias, teatro..."
              aria-label="Buscar eventos"
            />
            <a href="#eventos">Buscar</a>
          </div>
          <div className="quickStats" aria-label="Resumen de la plataforma">
            <span><b>+40</b> planes para descubrir</span>
            <span><b>10</b> categorías</span>
            <span><b>1</b> ciudad, todo en un lugar</span>
          </div>
        </div>
        <div className="heroVisual" aria-label="Eventos destacados de ejemplo">
          <div className="heroCard heroCardMain">
            <span className="floatingTag">DESTACADO</span>
            <div className="visualEmoji">🎶</div>
            <div>
              <small>VIERNES · 21:00</small>
              <h2>Festival de música en vivo</h2>
              <p>Centro Cultural · Comodoro Rivadavia</p>
            </div>
          </div>
          <div className="miniCard miniOne"><span>🎭</span><b>Teatro</b><small>Sábado</small></div>
          <div className="miniCard miniTwo"><span>🛍️</span><b>Feria</b><small>Este finde</small></div>
        </div>
      </section>

      <section className="section" id="categorias">
        <div className="sectionHeading">
          <div><span className="sectionKicker">EXPLORÁ</span><h2>¿Qué te gustaría hacer?</h2></div>
          <button className="textButton" type="button" onClick={() => setActiveCategory('Todos')}>Ver todas</button>
        </div>
        <div className="categoryGrid">
          {categories.map(([emoji, name]) => (
            <button
              key={name}
              type="button"
              className={`categoryCard ${activeCategory === name ? 'active' : ''}`}
              onClick={() => setActiveCategory(activeCategory === name ? 'Todos' : name)}
            >
              <span>{emoji}</span><b>{name}</b>
            </button>
          ))}
        </div>
      </section>


      <section
  style={{
    maxWidth: 1180,
    margin: '42px auto',
    padding: '0 20px',
  }}
>
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 16,
      marginBottom: 16,
      flexWrap: 'wrap',
    }}
  >
    <div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#7c3aed',
          letterSpacing: 1,
        }}
      >
        PUBLICIDAD
      </span>

      <h2 style={{ margin: '6px 0 0' }}>
        Negocios que te pueden interesar
      </h2>
    </div>

    <Link
      href="/publicite-aqui"
      style={{
        color: '#6d28d9',
        fontWeight: 900,
        textDecoration: 'none',
      }}
    >
      ¿Tenés un negocio? Publicitá acá →
    </Link>
  </div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 14,
    }}
  >
    {[1, 2, 3].map((slot) => (
      <div
        key={slot}
        style={{
          minHeight: 150,
          border: '1px solid #e9d5ff',
          borderRadius: 18,
          background: '#ffffff',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(109, 40, 217, 0.06)',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: '#7c3aed',
          }}
        >
          ESPACIO PUBLICITARIO
        </span>

        <div>
          <h3 style={{ margin: '8px 0 6px' }}>
            Tu negocio puede estar acá
          </h3>
          <p style={{ margin: 0, color: '#6b6475', fontSize: 14 }}>
            Mostrá tu negocio a personas de Comodoro Rivadavia.
          </p>
        </div>
      </div>
    ))}
  </div>
</section>
      <section className="section eventsSection" id="eventos">
        <div className="sectionHeading eventsHeading">
          <div><span className="sectionKicker">PRÓXIMOS PLANES</span><h2>Eventos para vos</h2></div>
        <button
  type="button"
  onClick={handleNearbyEvents}
  style={{
    border: nearbyOnly ? '2px solid #7c3aed' : '1px solid #d8ccf5',
    background: nearbyOnly ? '#7c3aed' : '#ffffff',
    color: nearbyOnly ? '#ffffff' : '#6d28d9',
    borderRadius: 999,
    padding: '10px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  }}
>
  📍 {nearbyOnly ? 'Mostrando cerca de mí' : 'Cerca de mí'}
</button> 
        </div>

        {visibleEvents.length ? (
          <div className="eventGrid">
            {visibleEvents.map((event) => (
              <article className="eventCard" key={event.id}>
                <div className="eventImage">
                  {event.coverImageUrl ? (
  <img
    src={event.coverImageUrl}
    alt={`Portada de ${event.title}`}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      inset: 0,
    }}
  />
) : (
  <span className="eventEmoji">{event.emoji}</span>
)}
                  <span className="categoryChip">{event.category}</span>
                  {event.featured && <span className="featuredChip">Destacado</span>}
                  <button
                    className={`heart ${favorites.includes(event.id) ? 'saved' : ''}`}
                    type="button"
                   onClick={() => toggleFavorite(event.id)}
                    aria-label={favorites.includes(event.id) ? `Quitar ${event.title} de favoritos` : `Guardar ${event.title} en favoritos`}
                  >{favorites.includes(event.id) ? '♥' : '♡'}</button>
                </div>
                <div className="eventBody">
                  <div className="dateRow"><b>{event.date}</b><span>{event.time}</span></div>
                  <h3>{event.title}</h3>
                  <p>📍 {event.place}</p>
                  {nearbyOnly && getDistanceText(event) && (
  <p>📍 {getDistanceText(event)}</p>
)}
                  <div className="eventFooter">
  <strong>{event.price}</strong>
  <a href={`/eventos/${event.id}`}>Ver evento →</a>
</div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <h3>{nearbyOnly ? '📍 No hay eventos cerca de tu ubicación por ahora' : '🔎 No encontramos eventos con ese filtro'}</h3>
            <p>{nearbyOnly ? 'Probá ver todos los eventos de Comodoro.' : 'Probá otra búsqueda o volvé a ver todos los planes.'}</p>
            <button type="button" onClick={() => { setQuery(''); setActiveCategory('Todos'); setNearbyOnly(false); setUserLatitude(null); setUserLongitude(null); }}>Ver todos los eventos</button>
          </div>
        )}
      </section>

      <section className="publishBanner" id="publicar">
        <div>
          <span className="sectionKicker light">PARA ORGANIZADORES</span>
          <h2>¿Tenés un evento para compartir?</h2>
          <p>Muy pronto vas a poder publicarlo y llegar a más personas de Comodoro Rivadavia.</p>
        </div>
        <a href="#inicio">Publicá tu evento <span>→</span></a>
      </section>

      <footer>
        <a className="brand footerBrand" href="#inicio"><span className="brandMark">Q</span><span>Qué Hacemos Comodoro</span></a>
        <p>Hecho para descubrir y disfrutar Comodoro Rivadavia.</p>
        <span>Prototipo · Próximamente con eventos reales</span>
      </footer>
    </main>
  );
}
