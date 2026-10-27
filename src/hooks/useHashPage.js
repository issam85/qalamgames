import { useState, useEffect } from 'react';

// Deep-linkbaar: lees de game-sleutel uit de URL-hash (bv. qalamgames.nl/#hajj → opent direct de game)
function pageFromHash(isPage) {
  const h = (window.location.hash || '').replace(/^#\/?/, '');
  return (h && isPage(h)) ? h : 'home';
}

export default function useHashPage(isPage) {
  const [page, setPage] = useState(() => pageFromHash(isPage));

  // Houd de URL-hash in sync met de huidige pagina → elke game heeft een deelbare link, en de back-knop werkt
  useEffect(() => {
    const current = (window.location.hash || '').replace(/^#\/?/, '');
    const target = page === 'home' ? '' : page;
    if (current === target) return;
    if (target) window.location.hash = target;                                                 // game openen → history-entry (browser-back keert terug)
    else window.history.replaceState(null, '', window.location.pathname + window.location.search); // terug naar home → hash netjes weghalen
  }, [page]);

  // Reageer op browser back/forward én op een direct geplakte/gedeelde link
  useEffect(() => {
    const onHash = () => setPage(pageFromHash(isPage));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [isPage]);

  return [page, setPage];
}
