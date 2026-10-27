import { Play } from 'lucide-react';
import LoopVideo from './LoopVideo';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-media">
        <picture>
          <source media="(max-width: 767px)" srcSet="/hero/hero-a-mobile.webp" />
          <img src="/hero/hero-a.webp" alt="" className="hero-img" />
        </picture>
        <LoopVideo src="/video/hero-a.mp4" poster="/hero/hero-a.webp" className="hero-img" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-content container">
        <div className="hero-text">
          <span className="hero-badge">Basisschool Al Qalam · Gouda</span>
          <h1 className="hero-title">Qalam Games</h1>
          <p className="hero-sub">Programmeren met AI</p>
          <p className="hero-lead">Leerlingen uit groep 6, 7 en 8 bouwen met AI hun eigen games. Speel ze hier gratis, per lichting.</p>
          <div className="hero-actions">
            <a href="#marioparty" className="btn btn-green btn-lg">
              <Play size={20} fill="currentColor" aria-hidden="true" /> Speel Mario Party
            </a>
            <a href="#lichtingen" className="btn btn-white btn-lg">Bekijk alle spellen</a>
          </div>
        </div>
      </div>
    </section>
  );
}
