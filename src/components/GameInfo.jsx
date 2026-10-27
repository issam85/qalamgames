import { useState } from 'react';
import { Link2, Check } from 'lucide-react';
import { GAMES, thumbOf } from '../data/games';
import { moreGames } from '../data/lichtingen';
import '../styles/game-info.css';

// Onder het spel: wie het maakte, besturing en uitleg (als die er is), deellink en meer spellen
export default function GameInfo({ gameKey, entry }) {
  const game = GAMES[gameKey];
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/#${gameKey}`;

  const copy = () => {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="container gv-info">
      <div className="gv-facts">
        {entry && (
          <div className="gv-fact">
            <span className="gv-fact-label">Gemaakt door</span>
            <span className="gv-fact-main">{entry.student}</span>
            <span className="gv-fact-text">{entry.klas} · {entry.lichting}</span>
          </div>
        )}
        {game.controls && (
          <div className="gv-fact">
            <span className="gv-fact-label">Besturing</span>
            {game.controls.map(([who, key]) => (
              <div key={who} className="gv-control">
                <span>{who}</span>
                <kbd>{key}</kbd>
              </div>
            ))}
          </div>
        )}
        {game.howto && (
          <div className="gv-fact">
            <span className="gv-fact-label">Zo speel je</span>
            <p className="gv-fact-text">{game.howto}</p>
          </div>
        )}
      </div>

      <div className="gv-share">
        <button type="button" className="btn btn-outline" onClick={copy}>
          {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
          {copied ? 'Gekopieerd!' : 'Kopieer link'}
        </button>
        <span className="gv-link">{link.replace(/^https?:\/\//, '')}</span>
      </div>

      <h2 className="gv-more-title">Meer spellen</h2>
      <div className="gv-more">
        {moreGames(gameKey).map((m) => (
          <a key={m.game} href={`#${m.game}`} className="gv-more-card" style={{ '--accent': GAMES[m.game].accent }}>
            <img src={thumbOf(m.game)} alt="" loading="lazy" />
            <span className="gv-more-body">
              <span className="gv-more-name">{m.title || GAMES[m.game].title}</span>
              <span className="gv-more-meta">{m.student} · {m.lichting}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
