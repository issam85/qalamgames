import React, { useState, useEffect, useRef } from 'react';
import { Star, Sparkles, Award } from 'lucide-react';

const IslamicRacingGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('medium');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(5);
  const gameLoopRef = useRef(null);

  const difficultySettings = {
    easy: { speed: 3, obstacleFrequency: 80, lanes: 3 },
    medium: { speed: 5, obstacleFrequency: 60, lanes: 4 },
    hard: { speed: 8, obstacleFrequency: 40, lanes: 5 }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCarPosition(50);
    setObstacles([]);
    setGameSpeed(difficultySettings[difficulty].speed);
  };

  const endGame = () => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState !== 'playing') return;

      const laneWidth = 100 / difficultySettings[difficulty].lanes;

      if (e.key === 'ArrowLeft') {
        setCarPosition(prev => Math.max(laneWidth / 2, prev - laneWidth));
      } else if (e.key === 'ArrowRight') {
        setCarPosition(prev => Math.min(100 - laneWidth / 2, prev + laneWidth));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, y: obs.y + gameSpeed }))
          .filter(obs => obs.y < 100);

        const carY = 85;
        const carWidth = 8;
        const collided = updated.some(obs => {
          const distance = Math.abs(obs.x - carPosition);
          return obs.y > carY - 8 && obs.y < carY + 8 && distance < carWidth;
        });

        if (collided) {
          endGame();
          return prev;
        }

        const passed = prev.filter(obs => obs.y < carY && obs.y + gameSpeed >= carY);
        if (passed.length > 0) {
          setScore(s => s + passed.length * 10);
        }

        return updated;
      });

      if (Math.random() * 100 < difficultySettings[difficulty].obstacleFrequency) {
        const lanes = difficultySettings[difficulty].lanes;
        const laneWidth = 100 / lanes;
        const lane = Math.floor(Math.random() * lanes);
        const x = (lane + 0.5) * laneWidth;

        setObstacles(prev => [...prev, {
          id: Date.now(),
          x,
          y: -10,
          type: Math.random() > 0.5 ? 'star' : 'geometric'
        }]);
      }
    }, 50);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState, gameSpeed, carPosition, difficulty]);

  if (gameState === 'menu') {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a0f0a 0%, #3d2817 50%, #1a0f0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Amiri", "Scheherazade New", serif',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Geometric pattern overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, #d4af37 35px, #d4af37 36px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, #d4af37 35px, #d4af37 36px)
          `,
          pointerEvents: 'none'
        }} />

        {/* Decorative stars */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          animation: 'twinkle 3s ease-in-out infinite'
        }}>
          <Star size={24} fill="#d4af37" color="#d4af37" />
        </div>
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          animation: 'twinkle 3s ease-in-out infinite 1s'
        }}>
          <Sparkles size={28} fill="#d4af37" color="#d4af37" />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          animation: 'twinkle 3s ease-in-out infinite 2s'
        }}>
          <Star size={20} fill="#d4af37" color="#d4af37" />
        </div>

        <div style={{
          textAlign: 'center',
          zIndex: 1,
          padding: '3rem',
          background: 'rgba(58, 35, 20, 0.7)',
          borderRadius: '20px',
          border: '3px solid #d4af37',
          boxShadow: '0 0 60px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(212, 175, 55, 0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 1s ease-out'
        }}>
          {/* Decorative top border */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            marginBottom: '2rem',
            borderRadius: '4px'
          }} />

          <div style={{
            fontSize: '4.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d4af37, #f4e3b5, #d4af37)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '0.15em',
            animation: 'shimmer 3s ease-in-out infinite',
            textShadow: '0 2px 20px rgba(212, 175, 55, 0.5)'
          }}>
            سباق السلام
          </div>

          <div style={{
            fontSize: '2rem',
            color: '#f4e3b5',
            marginBottom: '2.5rem',
            letterSpacing: '0.3em',
            fontWeight: 400
          }}>
            RACE OF PEACE
          </div>

          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{ animation: 'float 3s ease-in-out infinite' }}>
              <Star size={36} fill="#d4af37" color="#d4af37" />
            </div>
            <div style={{ animation: 'float 3s ease-in-out infinite 1s' }}>
              <Sparkles size={36} fill="#f4e3b5" color="#f4e3b5" />
            </div>
            <div style={{ animation: 'float 3s ease-in-out infinite 2s' }}>
              <Award size={36} fill="#d4af37" color="#d4af37" />
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              color: '#d4af37',
              fontSize: '1.4rem',
              marginBottom: '1.5rem',
              letterSpacing: '0.2em',
              fontWeight: 600
            }}>
              اختر مستواك
            </div>

            <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { value: 'easy', label: 'سهل', subtitle: 'Makkelijk' },
                { value: 'medium', label: 'متوسط', subtitle: 'Normaal' },
                { value: 'hard', label: 'صعب', subtitle: 'Moeilijk' }
              ].map(level => (
                <button
                  key={level.value}
                  onClick={() => setDifficulty(level.value)}
                  style={{
                    padding: '1.2rem 2rem',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    border: difficulty === level.value ? '3px solid #d4af37' : '2px solid rgba(212, 175, 55, 0.3)',
                    background: difficulty === level.value
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(244, 227, 181, 0.2))'
                      : 'rgba(58, 35, 20, 0.5)',
                    color: difficulty === level.value ? '#d4af37' : '#f4e3b5',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    transition: 'all 0.3s ease',
                    boxShadow: difficulty === level.value
                      ? '0 0 25px rgba(212, 175, 55, 0.5), inset 0 0 20px rgba(212, 175, 55, 0.1)'
                      : '0 4px 15px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'inherit',
                    borderRadius: '10px',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 0 35px rgba(212, 175, 55, 0.7), 0 8px 25px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = difficulty === level.value
                      ? '0 0 25px rgba(212, 175, 55, 0.5)'
                      : '0 4px 15px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{level.label}</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{level.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            style={{
              padding: '1.5rem 4rem',
              fontSize: '1.8rem',
              fontWeight: 700,
              border: '3px solid #d4af37',
              background: 'linear-gradient(135deg, #d4af37, #f4e3b5)',
              color: '#1a0f0a',
              cursor: 'pointer',
              letterSpacing: '0.3em',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)',
              fontFamily: 'inherit',
              borderRadius: '15px',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.08) translateY(-3px)';
              e.target.style.boxShadow = '0 0 60px rgba(212, 175, 55, 0.9), 0 15px 40px rgba(0, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) translateY(0)';
              e.target.style.boxShadow = '0 0 40px rgba(212, 175, 55, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)';
            }}
          >
            ابدأ اللعبة
          </button>

          {highScore > 0 && (
            <div style={{
              marginTop: '2rem',
              color: '#d4af37',
              fontSize: '1.2rem',
              letterSpacing: '0.15em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Award size={24} fill="#d4af37" color="#d4af37" />
              <span>أعلى نقاط: {highScore}</span>
            </div>
          )}

          {/* Decorative bottom border */}
          <div style={{
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            marginTop: '2rem',
            borderRadius: '4px'
          }} />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap');

          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
        `}</style>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a0f0a 0%, #3d2817 50%, #1a0f0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Amiri", serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(58, 35, 20, 0.8)',
          borderRadius: '20px',
          border: '3px solid #d4af37',
          boxShadow: '0 0 60px rgba(212, 175, 55, 0.4)',
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#d4af37',
            marginBottom: '1rem',
            letterSpacing: '0.2em',
            textShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
          }}>
            انتهت اللعبة
          </div>

          <div style={{
            fontSize: '1.8rem',
            color: '#f4e3b5',
            marginBottom: '2rem',
            letterSpacing: '0.15em'
          }}>
            GAME OVER
          </div>

          <div style={{
            fontSize: '2.5rem',
            color: '#d4af37',
            marginBottom: '1rem',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <Star size={32} fill="#d4af37" color="#d4af37" />
            النقاط: {score}
            <Star size={32} fill="#d4af37" color="#d4af37" />
          </div>

          {score === highScore && score > 0 && (
            <div style={{
              fontSize: '1.6rem',
              color: '#f4e3b5',
              marginBottom: '2rem',
              animation: 'pulse 1s infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <Award size={28} fill="#d4af37" color="#d4af37" />
              رقم قياسي جديد!
            </div>
          )}

          <button
            onClick={() => setGameState('menu')}
            style={{
              padding: '1.2rem 3rem',
              fontSize: '1.5rem',
              fontWeight: 700,
              border: '3px solid #d4af37',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(244, 227, 181, 0.2))',
              color: '#d4af37',
              cursor: 'pointer',
              letterSpacing: '0.2em',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
              fontFamily: 'inherit',
              transition: 'all 0.3s',
              borderRadius: '10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'linear-gradient(135deg, #d4af37, #f4e3b5)';
              e.target.style.color = '#1a0f0a';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(244, 227, 181, 0.2))';
              e.target.style.color = '#d4af37';
            }}
          >
            القائمة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  const laneWidth = 100 / difficultySettings[difficulty].lanes;

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(180deg, #2a1810 0%, #4a3020 50%, #2a1810 100%)',
      overflow: 'hidden',
      fontFamily: '"Amiri", serif',
      position: 'relative'
    }}>
      {/* Score display */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#d4af37',
        zIndex: 10,
        textShadow: '0 0 15px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.4)',
        letterSpacing: '0.1em',
        padding: '0.5rem 2rem',
        background: 'rgba(26, 15, 10, 0.7)',
        borderRadius: '15px',
        border: '2px solid rgba(212, 175, 55, 0.5)'
      }}>
        {score}
      </div>

      {/* Desert road */}
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #5a4a3a 0%, #3a2a1a 100%)',
        position: 'relative'
      }}>
        {/* Sand texture overlay */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(244, 227, 181, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        {/* Animated road lines with Islamic pattern */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '200%',
          top: '-100%',
          animation: 'roadScroll 2s linear infinite'
        }}>
          {Array.from({ length: difficultySettings[difficulty].lanes - 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${(i + 1) * laneWidth}%`,
                width: '4px',
                height: '100%',
                background: 'repeating-linear-gradient(to bottom, rgba(212, 175, 55, 0.4) 0px, rgba(212, 175, 55, 0.4) 20px, transparent 20px, transparent 40px)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
              }}
            />
          ))}
        </div>

        {/* Geometric pattern overlay */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.08,
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 40px, #d4af37 40px, #d4af37 41px),
            repeating-linear-gradient(-45deg, transparent, transparent 40px, #d4af37 40px, #d4af37 41px)
          `,
          pointerEvents: 'none'
        }} />

        {/* Obstacles */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            style={{
              position: 'absolute',
              left: `${obs.x}%`,
              top: `${obs.y}%`,
              width: '8%',
              height: '8%',
              transform: 'translate(-50%, -50%)',
              transition: 'none'
            }}
          >
            {obs.type === 'star' ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'rotate 3s linear infinite'
              }}>
                <Star
                  size={48}
                  fill="#c89b3c"
                  color="#d4af37"
                  strokeWidth={3}
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))'
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #c89b3c, #d4af37)',
                border: '3px solid #d4af37',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.8), inset 0 0 15px rgba(200, 155, 60, 0.5)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            )}
          </div>
        ))}

        {/* Player car - Mosque inspired design */}
        <div
          style={{
            position: 'absolute',
            left: `${carPosition}%`,
            bottom: '15%',
            width: '8%',
            height: '14%',
            transform: 'translateX(-50%)',
            transition: 'left 0.2s ease-out'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #d4af37, #c89b3c)',
            clipPath: 'polygon(20% 20%, 50% 0%, 80% 20%, 100% 100%, 0% 100%)',
            boxShadow: '0 0 30px rgba(212, 175, 55, 1), inset 0 0 20px rgba(244, 227, 181, 0.3)',
            position: 'relative',
            border: '2px solid #f4e3b5'
          }}>
            {/* Dome on top */}
            <div style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50%',
              height: '25%',
              background: 'radial-gradient(circle, #f4e3b5, #d4af37)',
              borderRadius: '50% 50% 0 0',
              border: '2px solid #f4e3b5',
              boxShadow: '0 0 10px rgba(244, 227, 181, 0.6)'
            }} />

            {/* Star decoration */}
            <div style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <Star size={16} fill="#f4e3b5" color="#f4e3b5" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions in Arabic and Dutch */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#f4e3b5',
        fontSize: '1.1rem',
        textAlign: 'center',
        letterSpacing: '0.1em',
        textShadow: '0 2px 10px rgba(26, 15, 10, 0.8)'
      }}>
        <div style={{ marginBottom: '0.3rem' }}>← → استخدم الأسهم للتحرك</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Gebruik de pijltjestoetsen om te bewegen</div>
      </div>

      <style>{`
        @keyframes roadScroll {
          from { top: -100%; }
          to { top: 0%; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default IslamicRacingGame;
