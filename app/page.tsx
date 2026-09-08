'use client';
// GitHub conectado con Vercel
import { useMemo, useState } from 'react';

type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  place: string;
  price: string;
  emoji: string;
  featured?: boolean;
};

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
    id: 1,
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
    id: 2,
    title: 'Feria de emprendedores',
    category: 'Ferias',
    date: 'Sáb 12 Sep',
    time: '15:00',
    place: 'Costanera',
    price: 'Gratis',
    emoji: '🧺',
  },
  {
    id: 3,
    title: 'Noche de teatro local',
    category: 'Cultura',
    date: 'Sáb 12 Sep',
    time: '20:30',
    place: 'Teatro de la ciudad',
    price: 'Consultar',
    emoji: '🎭',
  },
  {
    id: 4,
    title: 'Encuentro gastronómico',
    category: 'Gastronomía',
    date: 'Dom 13 Sep',
    time: '12:00',
    place: 'Parque Saavedra',
    price: 'Entrada libre',
    emoji: '🍔',
  },
  {
    id: 5,
    title: 'Tarde en familia',
    category: 'Familia',
    date: 'Dom 13 Sep',
    time: '16:00',
    place: 'Plaza Soberanía',
    price: 'Gratis',
    emoji: '🎈',
  },
  {
    id: 6,
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
  const [favorites, setFavorites] = useState<number[]>([]);

  const visibleEvents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return events.filter((event) => {
      const matchesCategory = activeCategory === 'Todos' || event.category === activeCategory;
      const haystack = `${event.title} ${event.category} ${event.place}`.toLocaleLowerCase('es');
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [query, activeCategory]);

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
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
          <button className="navFavorite" type="button" title="Favoritos">♡ <span>{favorites.length}</span></button>
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

      <section className="section eventsSection" id="eventos">
        <div className="sectionHeading eventsHeading">
          <div><span className="sectionKicker">PRÓXIMOS PLANES</span><h2>Eventos para vos</h2></div>
          <div className="filterPills" aria-label="Filtrar eventos">
            {['Todos', 'Música', 'Ferias', 'Cultura'].map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'selected' : ''}
                onClick={() => setActiveCategory(category)}
              >{category}</button>
            ))}
          </div>
        </div>

        {visibleEvents.length ? (
          <div className="eventGrid">
            {visibleEvents.map((event) => (
              <article className="eventCard" key={event.id}>
                <div className="eventImage">
                  <span className="eventEmoji">{event.emoji}</span>
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
                  <div className="eventFooter"><strong>{event.price}</strong><button type="button">Ver evento →</button></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <span>🔎</span><h3>No encontramos eventos con ese filtro</h3>
            <p>Probá otra búsqueda o volvé a ver todos los planes.</p>
            <button type="button" onClick={() => { setQuery(''); setActiveCategory('Todos'); }}>Ver todos los eventos</button>
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
