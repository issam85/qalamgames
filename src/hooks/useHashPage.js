import { useState, useEffect, useRef } from 'react';

// Deep-linkbaar: lees de game-sleutel uit de URL-hash (bv. qalamgames.nl/#hajj → opent direct de game)
function pageFromHash(isPage) {
  const h = (window.location.hash || '').replace(/^#\/?/, '');
  return (h && isPage(h)) ? h : 'home';
}

export default function useHashPage(isPage) {
  const [page, setPage] = useState(() => pageFromHash(isPage));
  const pageRef = useRef(page);
  const homeScroll = useRef(0);

  // Onthoud waar je op de homepage was als je een spel opent
  const goTo = (next) => {
    if (pageRef.current === 'home' && next !== 'home') homeScroll.current = window.scrollY;
    pageRef.current = next;
    setPage(next);
  };

  // Houd de URL-hash in sync met de huidige pagina → elke game heeft een deelbare link, en de back-knop werkt
  useEffect(() => {
    const current = (window.location.hash || '').replace(/^#\/?/, '');
    const target = page === 'home' ? '' : page;
    if (current !== target) {
      if (target) window.location.hash = target;                                                 // game openen → history-entry (browser-back keert terug)
      else window.history.replaceState(null, '', window.location.pathname + window.location.search); // terug naar home → hash netjes weghalen
    }
    // Spel begint bovenaan; terug op home kom je waar je was
    const y = page === 'home' ? homeScroll.current : 0;
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
  }, [page]);

  // Reageer op browser back/forward én op een direct geplakte/gedeelde link
  useEffect(() => {
    const onHash = () => goTo(pageFromHash(isPage));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [isPage]);

  return [page, goTo];
}
