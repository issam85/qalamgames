import { useRef } from 'react';
import { ArrowLeft, Maximize, Minimize } from 'lucide-react';
import IslamicRacingGame from '../IslamicRacingGame';
import useFullscreen from '../hooks/useFullscreen';
import { GAMES } from '../data/games';

export default function GameView({ gameKey, onBack }) {
  const containerRef = useRef(null);
  const game = GAMES[gameKey];
  const style = { ...game.bar, src: game.src, title: game.title };
  const { isFullscreen, showControls, toggleFullscreen, exitFullscreen, handleTap } = useFullscreen(containerRef);

  const handleBack = () => {
    exitFullscreen();
    onBack();
  };

  const buttonStyle = {
    pointerEvents: showControls ? 'auto' : 'none',
    background: style.bg,
    border: `2px solid ${style.border}`,
    color: style.color,
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      style={{ width: '100%', height: '100vh', position: 'relative', background: '#000' }}
    >
      {/* Top bar with back + fullscreen buttons */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        right: '0.5rem',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity: showControls ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); handleBack(); }}
          style={{ ...buttonStyle, padding: '0.5rem 1rem', gap: '0.5rem', fontFamily: style.font }}
        >
          <ArrowLeft size={18} />
          Terug
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          style={{ ...buttonStyle, padding: '0.5rem', justifyContent: 'center' }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>

      {/* Game content */}
      {gameKey === 'game' ? (
        <IslamicRacingGame />
      ) : (
        <iframe
          src={style.src}
          allow="fullscreen; accelerometer; gyroscope; autoplay; xr-spatial-tracking"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={style.title}
        />
      )}
    </div>
  );
}
