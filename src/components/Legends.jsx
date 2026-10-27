import { Trophy, Play } from 'lucide-react';
import { GAMES, thumbOf } from '../data/games';
import { LEGENDS } from '../data/lichtingen';
import '../styles/legends.css';

export default function Legends() {
  return (
    <section id="legends" className="legends">
      <div className="container">
        <div className="legends-head">
          <Trophy size={56} strokeWidth={1.8} aria-hidden="true" />
          <h2 className="section-title legends-title">Hall of Legends</h2>
          <p className="legends-sub">De winnaars van elke lichting</p>
        </div>
        <div className="legends-grid">
          {LEGENDS.map((l) => (
            <div key={l.label} className="legend">
              <img src={thumbOf(l.game)} alt="" loading="lazy" className="legend-img" />
              <div className="legend-body">
                <span className="legend-label">{l.label}</span>
                <span className="legend-name">{l.name}</span>
                <span className="legend-game">{GAMES[l.game].title.replace(/ V2$/, '')}</span>
                <span className="legend-meta">{l.meta}</span>
                <a href={`#${l.game}`} className="btn btn-gold legend-cta">
                  <Play size={16} fill="currentColor" aria-hidden="true" /> Speel
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
