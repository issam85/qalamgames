import { Play } from 'lucide-react';
import { GAMES, thumbOf } from '../data/games';
import '../styles/card.css';

// Eén kaart voor elk spel: thumbnail, badge (Nieuw of #rang), naam, leerling, cijfer, Speel (+ Versie 2)
export default function GameCard({ entry }) {
  const game = GAMES[entry.game];
  const title = entry.title || game.title;
  const badge = entry.rank ? `#${entry.rank}` : 'Nieuw';
  const badgeClass = entry.rank ? `card-badge rank-${Math.min(entry.rank, 4)}` : 'card-badge rank-new';

  return (
    <article className="card">
      <div className="card-media" style={{ '--accent': game.accent }}>
        <img src={thumbOf(entry.game)} alt="" loading="lazy" />
        <span className={badgeClass}>{badge}</span>
      </div>
      <div className="card-body">
        <h4 className={entry.game === 'game' ? 'card-title arabic' : 'card-title'}>{title}</h4>
        {entry.sub && <span className="card-sub">{entry.sub}</span>}
        <span className="card-student">{entry.student}</span>
        <div className="card-meta">
          <span>{entry.klas}</span>
          {entry.score && <span className="card-score">Cijfer {entry.score}</span>}
        </div>
        <div className="card-actions">
          <a href={`#${entry.game}`} className="btn btn-green">
            <Play size={14} fill="currentColor" aria-hidden="true" /> Speel
          </a>
          {entry.v2 && <a href={`#${entry.v2}`} className="btn btn-outline">Versie 2</a>}
        </div>
      </div>
    </article>
  );
}
