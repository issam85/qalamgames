import { useRef } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import IslamicRacingGame from '../IslamicRacingGame';
import GameInfo from './GameInfo';
import useFullscreen from '../hooks/useFullscreen';
import { GAMES } from '../data/games';
import { findEntry } from '../data/lichtingen';
import '../styles/game.css';

function BackButton({ onBack }) {
  return (
    <button type="button" className="btn btn-white" onClick={(e) => { e.stopPropagation(); onBack(); }}>
      <ArrowLeft size={18} strokeWidth={2.4} aria-hidden="true" /> Terug
    </button>
  );
}

function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <button
      type="button"
      className="btn btn-blue gv-icon-btn"
      aria-label={isFullscreen ? 'Volledig scherm sluiten' : 'Volledig scherm'}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
    >
      {isFullscreen ? <Minimize size={20} aria-hidden="true" /> : <Maximize size={20} aria-hidden="true" />}
    </button>
  );
}

// Desktop: balk, spel in een 16:9-kader en info eronder. Mobiel, volledig scherm en
// de React-game (die zelf 100vh gebruikt): schermvullend met de knoppen eroverheen.
export default function GameView({ gameKey, onBack }) {
  const containerRef = useRef(null);
  const game = GAMES[gameKey];
  const entry = findEntry(gameKey);
  const immersive = game.src === null;
  const { isFullscreen, showControls, toggleFullscreen, exitFullscreen, handleTap } = useFullscreen(containerRef);

  const handleBack = () => {
    exitFullscreen();
    onBack();
  };

  return (
    <div className={immersive ? 'gv gv-immersive' : 'gv'}>
      <header className="gv-bar">
        <div className="container gv-bar-inner">
          <BackButton onBack={handleBack} />
          <div className="gv-heading">
            <h1 className={gameKey === 'game' ? 'gv-title arabic' : 'gv-title'}>{game.title}</h1>
            {entry && <span className="gv-chip">{entry.lichting}</span>}
          </div>
          <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
        </div>
      </header>

      <div className="gv-stage container">
        <div ref={containerRef} className="gv-frame" onClick={handleTap}>
          <div className={showControls ? 'gv-overlay' : 'gv-overlay is-hidden'}>
            <BackButton onBack={handleBack} />
            <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          </div>
          {immersive ? (
            <IslamicRacingGame />
          ) : (
            <iframe
              src={game.src}
              allow="fullscreen; accelerometer; gyroscope; autoplay; xr-spatial-tracking"
              allowFullScreen
              title={game.title}
            />
          )}
        </div>
      </div>

      {!immersive && <GameInfo gameKey={gameKey} entry={entry} />}
    </div>
  );
}
