import { useState } from 'react';
import { Menu, X, Play } from 'lucide-react';
import '../styles/nav.css';

const LINKS = [
  ['#uitgelicht', 'Spellen'],
  ['#lichtingen', 'Lichtingen'],
  ['#legends', 'Hall of Legends'],
  ['#over', 'Over'],
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <nav className="nav-bar container" aria-label="Hoofdmenu">
        <a href="#top" className="nav-logo">
          <span className="nav-logo-mark" aria-hidden="true">Q</span>
          Qalam Games
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div id="nav-links" className={open ? 'nav-links is-open' : 'nav-links'}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="nav-link" onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="#marioparty" className="btn btn-gold nav-cta">
            <Play size={16} fill="currentColor" aria-hidden="true" /> Speel Mario Party
          </a>
        </div>
      </nav>
    </header>
  );
}
