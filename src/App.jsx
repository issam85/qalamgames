import React, { useState, useEffect, useRef } from 'react';
import { Star, Trophy, Medal, Award, Gamepad2, ArrowLeft, Code, Sparkles, Maximize, Minimize } from 'lucide-react';
import IslamicRacingGame from './IslamicRacingGame';

const top3 = [
  { rank: 1, name: 'Saifeddine Boulabkoul', game: 'Banana Storm Survivor', klas: 'Groep 7b', playable: 'bananastorm', v2: 'bananastorm2' },
  { rank: 2, name: 'Yahya Essanousi', game: 'Vice City Racing 3D', klas: 'Groep 6b', playable: 'vicecity', v2: 'vicecity2' },
  { rank: 3, name: 'Zakaria El Aamim', game: 'سباق السلام', gameSubtitle: 'Race of Peace', klas: 'Groep 6b', playable: 'game' },
];

const honorable = [
  { rank: 4, name: 'Marouan El Amrani', game: 'Penalty Shooters Pro', gameSubtitle: 'Toernooi Edition', klas: 'Groep 7c', playable: 'penalty' },
  { rank: 5, name: 'Mahir Tazammourti', game: 'Auto Spel met Islam Vragen', klas: 'Groep 6a', playable: 'autospel', v2: 'autospel2' },
  { rank: 6, name: 'Reda Oruadia', game: 'Turbo Racer 3D - Mega Maps', klas: 'Groep 6c', playable: 'turboracer', v2: 'turboracer2' },
  { rank: 7, name: 'Junayd Bakkali', game: 'Turbo Race', klas: 'Groep 6a', playable: 'turborace' },
];

// Lichting 2 — Tweede ronde gamemakers (gerangschikt op beoordeling)
const lichting2Top3 = [
  { rank: 1, name: 'Mohamed Fatehi', game: 'Fifa Ultimate', klas: 'Groep 7c', playable: 'fifaultimate', score: '9.48' },
  { rank: 2, name: 'Abdoerrahmaan Ezzarfani', game: 'Sonic Ultimate', klas: 'Groep 7c', playable: 'sonicultimate', score: '9.16' },
  { rank: 3, name: 'Amin van Ee', game: 'Stunt Racer', klas: 'Groep 6b', playable: 'stuntracer', score: '9.00' },
];
const lichting2Rest = [
  { rank: 4, name: 'Abdulahi Abdulkhader', game: "Granny's Nightmare", klas: 'Groep 7c', playable: 'grannyhorrorgame', score: '8.63' },
  { rank: 5, name: 'Junayd Bakkali', game: 'Turbo Race', klas: 'Groep 6a', playable: 'turborace', score: '8.41' },
  { rank: 6, name: 'Adam El Majidi', game: 'Basketball Islam', klas: 'Groep 7b', playable: 'basketballislam', score: '8.14' },
  { rank: 7, name: 'Imran Mestour', game: 'Voetbal Legends', klas: 'Groep 6a', playable: 'kickoff3d', score: '7.50' },
  { rank: 8, name: 'Youssef El Mahjoubi', game: 'MijnCraft', klas: 'Groep 6b', playable: 'mijncraft', score: '7.19' },
];

const rankIcons = {
  1: <Trophy size={40} fill="#FFD700" color="#FFD700" />,
  2: <Medal size={36} fill="#C0C0C0" color="#C0C0C0" />,
  3: <Award size={36} fill="#CD7F32" color="#CD7F32" />,
};

const rankColors = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

// Game configurations for styling
const gameStyles = {
  turboracer:    { border: '#00ff88', color: '#00ff88', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/turboracer.html', title: 'Turbo Racer 3D' },
  mariospel:     { border: '#e52521', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/mariospel.html', title: 'Mario-achtig Spel' },
  autospel:      { border: '#f5576c', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/autospel.html', title: 'Auto Spel met Islam Vragen' },
  bananastorm:   { border: '#667eea', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/bananastorm.html', title: 'Banana Storm Survivor' },
  vicecity:      { border: '#ff00ff', color: '#ff00ff', bg: 'rgba(0,0,0,0.8)', font: 'Impact, sans-serif', src: '/vicecity.html', title: 'Vice City Racing 3D' },
  penalty:       { border: '#4caf50', color: '#4caf50', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/penalty.html', title: 'Penalty Shooters Pro' },
  bananastorm2:  { border: '#667eea', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/bananastorm2.html', title: 'Banana Storm Survivor V2' },
  vicecity2:     { border: '#ff00ff', color: '#ff00ff', bg: 'rgba(0,0,0,0.8)', font: 'Impact, sans-serif', src: '/vicecity2.html', title: 'Vice City Racing 3D V2' },
  autospel2:     { border: '#f5576c', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/autospel2.html', title: 'Auto Spel V2' },
  turboracer2:   { border: '#00ff88', color: '#00ff88', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/turboracer2.html', title: 'Turbo Racer 3D V2' },
  mariospel2:    { border: '#e52521', color: '#fff', bg: 'rgba(0,0,0,0.8)', font: 'sans-serif', src: '/mariospel2.html', title: 'Mario-achtig Spel V2' },
  game:          { border: '#d4af37', color: '#d4af37', bg: 'rgba(26,15,10,0.8)', font: '"Amiri", serif', src: null, title: 'سباق السلام' },
  grannyhorrorgame: { border: '#cc0000', color: '#ff2200', bg: 'rgba(0,0,0,0.95)', font: '"Creepster", cursive, sans-serif', src: '/grannyhorrorgame.html', title: "Granny's Nightmare" },
  sonicultimate:    { border: '#0066ff', color: '#00ccff', bg: 'rgba(0,0,30,0.9)', font: '"Press Start 2P", monospace, sans-serif', src: '/sonicultimate.html', title: 'Sonic Ultimate' },
  kickoff3d:        { border: '#ffd700', color: '#ffd700', bg: 'rgba(10,10,15,0.9)', font: '"Bebas Neue", sans-serif', src: '/kickoff3d.html', title: 'Voetbal Legends' },
  stuntracer:       { border: '#ff6600', color: '#ffcc00', bg: 'rgba(10,5,0,0.9)', font: '"Orbitron", sans-serif', src: '/stuntracer.html', title: 'Stunt Racer' },
  fifaultimate:     { border: '#c8960a', color: '#c8960a', bg: 'rgba(10,18,8,0.9)', font: '"Arial Black", Arial, sans-serif', src: '/fifaultimate.html', title: 'Fifa Ultimate' },
  mijncraft:        { border: '#6FFFA0', color: '#6FFFA0', bg: 'rgba(7,20,40,0.9)', font: '"VT323", "Courier New", monospace', src: '/mijncraft.html', title: 'MijnCraft' },
  basketballislam:  { border: '#FDB927', color: '#FDB927', bg: 'rgba(4,4,12,0.95)', font: 'monospace', src: '/basketballislam.html', title: 'Basketball Islam' },
  turborace:        { border: '#ff6600', color: '#ff9933', bg: 'rgba(8,8,16,0.95)', font: 'monospace', src: '/turborace.html', title: 'Turbo Race' },
};

function GameView({ gameKey, onBack }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const style = gameStyles[gameKey];

  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    // Standard Fullscreen API (works on Android Chrome, Desktop)
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (request) {
      request.call(el).catch(() => {});
    }
    // Also try to lock screen orientation to landscape for better game experience
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
    // iOS fallback: scroll to hide address bar
    if (isIOS) {
      window.scrollTo(0, 1);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Auto-request fullscreen on mobile when game opens
  useEffect(() => {
    if (isMobile && containerRef.current) {
      // Fullscreen API requires a user gesture, so we show a prompt instead of auto-requesting
      // But we can try - some browsers allow it after a recent interaction
      const timer = setTimeout(() => {
        enterFullscreen();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Hide buttons after a few seconds of inactivity, show on tap
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  useEffect(() => {
    if (isFullscreen) {
      hideTimer.current = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(hideTimer.current);
    } else {
      setShowControls(true);
    }
  }, [isFullscreen]);

  const handleTap = () => {
    if (isFullscreen && !showControls) {
      setShowControls(true);
      hideTimer.current = setTimeout(() => setShowControls(false), 4000);
    }
  };

  const handleBack = () => {
    exitFullscreen();
    onBack();
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
          style={{
            pointerEvents: showControls ? 'auto' : 'none',
            background: style.bg,
            border: `2px solid ${style.border}`,
            color: style.color,
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontFamily: style.font,
          }}
        >
          <ArrowLeft size={18} />
          Terug
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
          style={{
            pointerEvents: showControls ? 'auto' : 'none',
            background: style.bg,
            border: `2px solid ${style.border}`,
            color: style.color,
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}
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
          allow="fullscreen"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={style.title}
        />
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [activeTab, setActiveTab] = useState('lichting2');

  // Render any game page using the unified GameView
  if (page !== 'home' && gameStyles[page]) {
    return <GameView gameKey={page} onBack={() => setPage('home')} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a0f0a 0%, #2d1a10 50%, #1a0f0a 100%)',
      fontFamily: '"Amiri", "Scheherazade New", serif',
      color: '#f4e3b5',
    }}>
      {/* Hero Section with School Image */}
      <header style={{
        position: 'relative',
        width: '100%',
        height: '60vh',
        minHeight: '400px',
        overflow: 'hidden',
      }}>
        <img
          className="hero-img"
          src="/school.png"
          alt="Al Qalam School"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(26,15,10,0.3) 0%, rgba(26,15,10,0.7) 70%, #1a0f0a 100%)',
        }} />
        {/* Hero text */}
        <div className="hero-text" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '90%',
          maxWidth: '800px',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d4af37, #f4e3b5, #d4af37)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
          }}>
            Qalam Games
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            color: '#f4e3b5',
            opacity: 0.9,
            letterSpacing: '0.1em',
          }}>
            Programmeren met AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
      }}>
        {/* Intro Section */}
        <section style={{
          textAlign: 'center',
          marginBottom: '4rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <Code size={32} color="#d4af37" />
            <Sparkles size={32} color="#d4af37" />
            <Gamepad2 size={32} color="#d4af37" />
          </div>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#d4af37',
            marginBottom: '1.5rem',
            letterSpacing: '0.05em',
          }}>
            Wat is Qalam Games?
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.8,
            maxWidth: '700px',
            margin: '0 auto 1.5rem',
            opacity: 0.9,
          }}>
            Bij Qalam Games leren leerlingen van <strong style={{ color: '#d4af37' }}>groep 6, 7 en 8</strong> hoe
            ze hun eigen spellen kunnen maken met behulp van <strong style={{ color: '#d4af37' }}>kunstmatige intelligentie (AI)</strong>.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.8,
            maxWidth: '700px',
            margin: '0 auto 1.5rem',
            opacity: 0.9,
          }}>
            Leerlingen ontdekken hoe ze met AI kunnen samenwerken om echte, werkende games te bouwen.
            Geen ervaring nodig — alleen creativiteit en nieuwsgierigheid!
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}>
            {['Groep 6', 'Groep 7', 'Groep 8'].map((groep) => (
              <div key={groep} style={{
                padding: '1rem 2rem',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#d4af37',
                letterSpacing: '0.1em',
              }}>
                {groep}
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{
          width: '60%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          margin: '0 auto 3rem',
        }} />

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '3rem',
        }}>
          {[
            { key: 'lichting2', label: 'Lichting 2' },
            { key: 'lichting1', label: 'Lichting 1' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.8rem 2rem',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                fontWeight: 700,
                fontFamily: 'inherit',
                border: '2px solid #d4af37',
                borderRadius: '12px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, #d4af37, #f4e3b5)'
                  : 'transparent',
                color: activeTab === tab.key ? '#1a0f0a' : '#d4af37',
                boxShadow: activeTab === tab.key
                  ? '0 0 25px rgba(212, 175, 55, 0.4)'
                  : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lichting 1 Content */}
        {activeTab === 'lichting1' && (
          <>
            <section style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <p style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                opacity: 0.7,
              }}>
                De eerste groep gamemakers van Al Qalam
              </p>
            </section>

            {/* Top 3 Section */}
            <section style={{
              textAlign: 'center',
              marginBottom: '4rem',
            }}>
              <h3 style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                color: '#d4af37',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
              }}>
                Top 3 Beste Spellen
              </h3>
              <p style={{
                fontSize: '1rem',
                opacity: 0.7,
                marginBottom: '2.5rem',
              }}>
                De leerlingen met het beste zelfgemaakte spel
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {top3.map((student) => (
                  <div key={student.rank} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1.2rem 1.5rem',
                    background: 'rgba(58, 35, 20, 0.6)',
                    border: `2px solid ${rankColors[student.rank]}40`,
                    borderRadius: '14px',
                    boxShadow: `0 0 20px ${rankColors[student.rank]}15`,
                    transition: 'transform 0.2s',
                  }}>
                    <div style={{ flexShrink: 0 }}>
                      {rankIcons[student.rank]}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: rankColors[student.rank],
                        marginBottom: '0.2rem',
                      }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                        {student.gameSubtitle ? (
                          <><span dir="rtl">{student.game}</span> — {student.gameSubtitle}</>
                        ) : (
                          student.game
                        )}
                        {student.klas ? ` — ${student.klas}` : ''}
                      </div>
                    </div>
                    {student.playable ? (
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button
                          onClick={() => setPage(student.playable)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            border: '2px solid #d4af37',
                            background: 'linear-gradient(135deg, #d4af37, #f4e3b5)',
                            color: '#1a0f0a',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Gamepad2 size={16} />
                          Speel
                        </button>
                        {student.v2 && (
                          <button
                            onClick={() => setPage(student.v2)}
                            style={{
                              padding: '0.5rem 0.8rem',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              border: '2px solid #d4af37',
                              background: 'transparent',
                              color: '#d4af37',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontFamily: 'inherit',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37, #f4e3b5)';
                              e.currentTarget.style.color = '#1a0f0a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#d4af37';
                            }}
                          >
                            V2
                          </button>
                        )}
                      </div>
                    ) : (
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: rankColors[student.rank],
                        opacity: 0.5,
                      }}>
                        #{student.rank}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Honorable Mentions */}
            <section style={{
              textAlign: 'center',
              marginBottom: '3rem',
            }}>
              <h4 style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                color: '#f4e3b5',
                marginBottom: '1.5rem',
                letterSpacing: '0.05em',
                opacity: 0.8,
              }}>
                Eervolle vermelding
              </h4>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {honorable.map((student) => (
                  <div key={student.rank} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.2rem',
                    padding: '1rem 1.5rem',
                    background: 'rgba(58, 35, 20, 0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '14px',
                  }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#d4af37',
                      opacity: 0.5,
                      flexShrink: 0,
                      width: '40px',
                    }}>
                      #{student.rank}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: '#f4e3b5',
                        marginBottom: '0.2rem',
                      }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {student.game}{student.klas ? ` — ${student.klas}` : ''}
                      </div>
                    </div>
                    {student.playable && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button
                          onClick={() => setPage(student.playable)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            border: '2px solid rgba(212, 175, 55, 0.5)',
                            background: 'rgba(212, 175, 55, 0.2)',
                            color: '#d4af37',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37, #f4e3b5)';
                            e.currentTarget.style.color = '#1a0f0a';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                            e.currentTarget.style.color = '#d4af37';
                          }}
                        >
                          <Gamepad2 size={14} />
                          Speel
                        </button>
                        {student.v2 && (
                          <button
                            onClick={() => setPage(student.v2)}
                            style={{
                              padding: '0.4rem 0.6rem',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              border: '2px solid rgba(212, 175, 55, 0.5)',
                              background: 'transparent',
                              color: '#d4af37',
                              cursor: 'pointer',
                              borderRadius: '8px',
                              fontFamily: 'inherit',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37, #f4e3b5)';
                              e.currentTarget.style.color = '#1a0f0a';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '#d4af37';
                            }}
                          >
                            V2
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Lichting 2 Content */}
        {activeTab === 'lichting2' && (
          <>
            <section style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', opacity: 0.7 }}>
                De nieuwe generatie gamemakers
              </p>
            </section>

            {/* Top 3 Lichting 2 */}
            <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: '#d4af37', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Top 3 Beste Spellen
              </h3>
              <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '2.5rem' }}>
                De leerlingen met het beste zelfgemaakte spel
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                {lichting2Top3.map((student) => (
                  <div key={student.rank} style={{
                    display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem',
                    background: 'rgba(58, 35, 20, 0.6)',
                    border: `2px solid ${rankColors[student.rank]}40`,
                    borderRadius: '14px',
                    boxShadow: `0 0 20px ${rankColors[student.rank]}15`,
                  }}>
                    <div style={{ flexShrink: 0 }}>{rankIcons[student.rank]}</div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 700, color: rankColors[student.rank], marginBottom: '0.2rem' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                        {student.game} — {student.klas}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.85rem', color: rankColors[student.rank], fontWeight: 700, opacity: 0.7 }}>{student.score}</span>
                      <button
                        onClick={() => setPage(student.playable)}
                        style={{
                          padding: '0.5rem 1rem', fontSize: '0.95rem', fontWeight: 700,
                          border: '2px solid #d4af37', background: 'linear-gradient(135deg, #d4af37, #f4e3b5)',
                          color: '#1a0f0a', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.6)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <Gamepad2 size={16} /> Speel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Eervolle vermelding Lichting 2 */}
            <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h4 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: '#f4e3b5', marginBottom: '1.5rem', letterSpacing: '0.05em', opacity: 0.8 }}>
                Eervolle vermelding
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                {lichting2Rest.map((student) => (
                  <div key={student.rank} style={{
                    display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1rem 1.5rem',
                    background: 'rgba(58, 35, 20, 0.4)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '14px',
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', opacity: 0.5, flexShrink: 0, width: '40px' }}>
                      #{student.rank}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4e3b5', marginBottom: '0.2rem' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {student.game} — {student.klas}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.8rem', color: '#d4af37', opacity: 0.5 }}>{student.score}</span>
                      {student.playable && (
                        <button
                          onClick={() => setPage(student.playable)}
                          style={{
                            padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 700,
                            border: '2px solid rgba(212, 175, 55, 0.5)', background: 'rgba(212, 175, 55, 0.2)',
                            color: '#d4af37', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #d4af37, #f4e3b5)'; e.currentTarget.style.color = '#1a0f0a'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.color = '#d4af37'; }}
                        >
                          <Gamepad2 size={14} /> Speel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        opacity: 0.6,
        fontSize: '0.9rem',
      }}>
        Qalam Games — Al Qalam School
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap');

        @media (max-width: 600px) {
          .hero-img {
            object-position: 30% 35% !important;
            transform: scale(1.4);
            transform-origin: 30% 35%;
          }
          .hero-text {
            top: 40% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
