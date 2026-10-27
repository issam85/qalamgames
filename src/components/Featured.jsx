import { Play } from 'lucide-react';
import LoopVideo from './LoopVideo';
import { GAMES, thumbOf } from '../data/games';
import { FEATURED } from '../data/lichtingen';
import '../styles/sections.css';

function Media({ gameKey }) {
  const game = GAMES[gameKey];
  return (
    <>
      <img src={thumbOf(gameKey)} alt="" className="feature-img" loading="lazy" />
      <LoopVideo src={game.video} poster={thumbOf(gameKey)} className="feature-img" />
    </>
  );
}

export default function Featured() {
  const [main, ...rest] = FEATURED;
  return (
    <section id="uitgelicht" className="section container">
      <span className="eyebrow">Uitgelicht</span>
      <h2 className="section-title featured-title">Onze topspellen</h2>

      <article className="feature-main">
        <div className="feature-main-media">
          <Media gameKey={main.game} />
          <span className="badge badge-new feature-badge">Nieuw · {main.lichting}</span>
        </div>
        <div className="feature-main-body">
          <h3 className="feature-main-title">{GAMES[main.game].title}</h3>
          <p className="feature-text">{GAMES[main.game].blurb}</p>
          <div className="chips">
            {main.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
            <span className="tag tag-gold">{main.maker}</span>
          </div>
          <a href={`#${main.game}`} className="btn btn-green btn-lg feature-cta">
            <Play size={18} fill="currentColor" aria-hidden="true" /> Speel nu
          </a>
        </div>
      </article>

      <div className="feature-grid">
        {rest.map((f) => (
          <article key={f.game} className="feature-card">
            <div className="feature-card-media"><Media gameKey={f.game} /></div>
            <div className="feature-card-body">
              <h3 className="feature-card-title">{GAMES[f.game].title}</h3>
              <p className="feature-text">{GAMES[f.game].blurb}</p>
              <span className="feature-maker">{f.maker}</span>
              <a href={`#${f.game}`} className="btn btn-blue feature-cta">
                <Play size={16} fill="currentColor" aria-hidden="true" /> Speel nu
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
