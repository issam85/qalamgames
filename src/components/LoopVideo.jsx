import { useEffect, useState } from 'react';

// Alleen op brede schermen en zonder 'minder beweging'; anders blijft het stilstaande beeld eronder staan
const QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';

// Muted moet als property gezet zijn vóór play(), anders blokkeert de browser autoplay
const startMuted = (el) => {
  if (!el) return;
  el.muted = true;
  const p = el.play();
  if (p && p.catch) p.catch(() => {});
};

export default function LoopVideo({ src, poster, className }) {
  const [enabled, setEnabled] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setEnabled(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  if (!enabled || !src) return null;
  return (
    <video
      ref={startMuted}
      className={className}
      src={src}
      poster={poster}
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
