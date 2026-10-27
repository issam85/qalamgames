import React, { useState } from 'react';
import { Star, Trophy, Medal, Award, Gamepad2, Code, Sparkles } from 'lucide-react';
import GameView from './components/GameView';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Featured from './components/Featured';
import useHashPage from './hooks/useHashPage';
import { GAMES } from './data/games';
import { top3, honorable, lichting2Top3, lichting2Rest, cardLichtingen } from './data/lichtingen';

const isGamePage = (key) => !!GAMES[key];

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

function App() {
  const [page, setPage] = useHashPage(isGamePage);
  const [activeTab, setActiveTab] = useState('lichting4');

  // Render any game page using the unified GameView
  if (page !== 'home' && GAMES[page]) {
    return <GameView gameKey={page} onBack={() => setPage('home')} />;
  }

  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Featured />

      {/* Oude onderkant (wordt in de volgende stap vervangen) */}
      <div style={{
        background: 'linear-gradient(180deg, #1a0f0a 0%, #2d1a10 50%, #1a0f0a 100%)',
        fontFamily: '"Amiri", "Scheherazade New", serif',
        color: '#f4e3b5',
        marginTop: '96px',
      }}>
      <main style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
      }}>
        {/* Legends Section */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👑</div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#d4af37',
            marginBottom: '0.5rem', letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
          }}>
            Hall of Legends
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.6, marginBottom: '2rem' }}>
            De winnaars van elke lichting
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
          }}>
            {[
              { label: 'Lichting 1', name: 'Saifeddine Boulabkoul', game: 'Banana Storm Survivor', klas: 'Groep 7b', playable: 'bananastorm2' },
              { label: 'Lichting 2', name: 'Mohamed Fatehi', game: 'Fifa Ultimate', klas: 'Groep 7c', playable: 'fifaultimate', score: '9.48' },
            ].map((legend, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(58, 35, 20, 0.6))',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '16px', padding: '1.5rem 2rem', minWidth: '260px', maxWidth: '340px',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)',
              }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#d4af37', opacity: 0.7, marginBottom: '0.5rem' }}>
                  {legend.label.toUpperCase()}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>🏆</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFD700', marginBottom: '0.2rem' }}>
                  {legend.name}
                </div>
                <div style={{ fontSize: '0.95rem', opacity: 0.8, marginBottom: '0.2rem' }}>
                  {legend.game}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.8rem' }}>
                  {legend.klas}{legend.score ? ` — ${legend.score}` : ''}
                </div>
                <button
                  onClick={() => setPage(legend.playable)}
                  style={{
                    padding: '0.5rem 1.5rem', fontSize: '0.9rem', fontWeight: 700,
                    border: '2px solid #d4af37', background: 'linear-gradient(135deg, #d4af37, #f4e3b5)',
                    color: '#1a0f0a', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.6)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Gamepad2 size={16} /> Speel
                </button>
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
            { key: 'lichting4', label: 'Lichting 4' },
            { key: 'lichting3', label: 'Lichting 3' },
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

        {/* Lichting 4 en 3 Content */}
        {cardLichtingen[activeTab] && (
          <>
            <section style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', opacity: 0.7 }}>
                {cardLichtingen[activeTab].subtitle}
              </p>
            </section>
            <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {cardLichtingen[activeTab].students.map((student) => (
                  <div key={student.playable} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(58, 35, 20, 0.6))',
                    border: '2px solid rgba(212, 175, 55, 0.5)',
                    borderRadius: '16px', padding: '1.8rem 2rem', minWidth: '260px', maxWidth: '340px',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)',
                  }}>
                    <div style={{ fontSize: '2.6rem', marginBottom: '0.4rem' }}>{student.emoji}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFD700', marginBottom: '0.2rem' }}>
                      {student.game}
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.85, marginBottom: '0.1rem' }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1rem' }}>
                      {student.klas}
                    </div>
                    <button
                      onClick={() => setPage(student.playable)}
                      style={{
                        padding: '0.5rem 1.5rem', fontSize: '0.9rem', fontWeight: 700,
                        border: '2px solid #d4af37', background: 'linear-gradient(135deg, #d4af37, #f4e3b5)',
                        color: '#1a0f0a', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit',
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.6)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <Gamepad2 size={16} /> Speel
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

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

      </div>
    </>
  );
}

export default App;
