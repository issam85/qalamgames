import React, { useState } from 'react';
import { Trophy, Medal, Award, Gamepad2, ArrowLeft, Code, Sparkles } from 'lucide-react';
import IslamicRacingGame from './IslamicRacingGame';

// ============================================================
//  SPELLEN — key -> iframe-bron (of component) + accentkleur
// ============================================================
const GAMES = {
  // Lichting 1
  bananastorm: { src: '/bananastorm.html', accent: '#667eea', title: 'Banana Storm Survivor' },
  vicecity:    { src: '/vicecity.html',    accent: '#ff00ff', title: 'Vice City Racing 3D' },
  game:        { component: true,          accent: '#d4af37', title: 'سباق السلام' },
  penalty:     { src: '/penalty.html',     accent: '#4caf50', title: 'Penalty Shooters Pro' },
  autospel:    { src: '/autospel.html',    accent: '#f5576c', title: 'Auto Spel met Islam Vragen' },
  turboracer:  { src: '/turboracer.html',  accent: '#00ff88', title: 'Turbo Racer 3D' },
  turborace:   { src: '/turborace.html',   accent: '#00ff88', title: 'Turbo Race' },
  // Lichting 2
  fifaultimate:     { src: '/fifaultimate.html',     accent: '#1db954', title: 'Fifa Ultimate' },
  sonicultimate:    { src: '/sonicultimate.html',    accent: '#3b82f6', title: 'Sonic Ultimate' },
  stuntracer:       { src: '/stuntracer.html',       accent: '#f59e0b', title: 'Stunt Racer' },
  grannyhorrorgame: { src: '/grannyhorrorgame.html', accent: '#9333ea', title: "Granny's Nightmare" },
  basketballislam:  { src: '/basketballislam.html',  accent: '#ea580c', title: 'Basketball Islam' },
  kickoff3d:        { src: '/kickoff3d.html',        accent: '#22c55e', title: 'Voetbal Legends' },
  mijncraft:        { src: '/mijncraft.html',        accent: '#16a34a', title: 'MijnCraft' },
  // Lichting 3
  hajj:        { src: '/hajj/index.html', accent: '#d4af37', title: 'Hajj Simulator 3D' },
};

// ============================================================
//  LICHTINGEN — per cohort: subtitel + leerlingen (met/zonder cijfer)
// ============================================================
const LICHTINGEN = {
  lichting3: {
    label: 'Lichting 3',
    subtitle: 'De nieuwste lichting',
    heading: 'Nieuw spel',
    headingSub: 'Vers van de pers — meer spellen volgen binnenkort',
    scored: false,
    students: [
      { rank: 1, name: 'Hajj Simulator 3D', game: 'رحلة الحج', gameSubtitle: 'Een educatieve 3D-reis door de Hajj', playable: 'hajj' },
    ],
  },
  lichting2: {
    label: 'Lichting 2',
    subtitle: 'De nieuwe generatie gamemakers',
    heading: 'Top 3 Beste Spellen',
    headingSub: 'De leerlingen met het beste zelfgemaakte spel',
    scored: true,
    students: [
      { rank: 1, name: 'Mohamed Fatehi',          game: 'Fifa Ultimate',     klas: 'Groep 7c', score: '9.48', playable: 'fifaultimate' },
      { rank: 2, name: 'Abdoerrahmaan Ezzarfani', game: 'Sonic Ultimate',    klas: 'Groep 7c', score: '9.16', playable: 'sonicultimate' },
      { rank: 3, name: 'Amin van Ee',             game: 'Stunt Racer',       klas: 'Groep 6b', score: '9.00', playable: 'stuntracer' },
      { rank: 4, name: 'Abdulahi Abdulkhader',    game: "Granny's Nightmare", klas: 'Groep 7c', score: '8.63', playable: 'grannyhorrorgame' },
      { rank: 5, name: 'Junayd Bakkali',          game: 'Turbo Race',        klas: 'Groep 6a', score: '8.41', playable: 'turborace' },
      { rank: 6, name: 'Adam El Majidi',          game: 'Basketball Islam',  klas: 'Groep 7b', score: '8.14', playable: 'basketballislam' },
      { rank: 7, name: 'Imran Mestour',           game: 'Voetbal Legends',   klas: 'Groep 6a', score: '7.50', playable: 'kickoff3d' },
      { rank: 8, name: 'Youssef El Mahjoubi',     game: 'MijnCraft',         klas: 'Groep 6b', score: '7.19', playable: 'mijncraft' },
    ],
  },
  lichting1: {
    label: 'Lichting 1',
    subtitle: 'De eerste groep gamemakers van Al Qalam',
    heading: 'Top 3 Beste Spellen',
    headingSub: 'De leerlingen met het beste zelfgemaakte spel',
    scored: false,
    students: [
      { rank: 1, name: 'Saifeddine Boulabkoul', game: 'Banana Storm Survivor', klas: 'Groep 7b', playable: 'bananastorm' },
      { rank: 2, name: 'Yahya Essanousi',       game: 'Vice City Racing 3D',   klas: 'Groep 6b', playable: 'vicecity' },
      { rank: 3, name: 'Zakaria El Aamim',      game: 'سباق السلام', gameSubtitle: 'Race of Peace', klas: 'Groep 6b', playable: 'game' },
      { rank: 4, name: 'Marouan El Amrani',     game: 'Penalty Shooters Pro', gameSubtitle: 'Toernooi Edition', klas: 'Groep 7c', playable: 'penalty' },
      { rank: 5, name: 'Mahir Tazammourti',     game: 'Auto Spel met Islam Vragen', klas: 'Groep 6a', playable: 'autospel' },
      { rank: 6, name: 'Reda Oruadia',          game: 'Turbo Racer 3D - Mega Maps', klas: 'Groep 6c', playable: 'turboracer' },
      { rank: 7, name: 'Junayd Bakkali',        game: 'Turbo Race',           klas: 'Groep 6a', playable: 'turborace' },
    ],
  },
};
const TAB_ORDER = ['lichting3', 'lichting2', 'lichting1'];

const rankIcons = {
  1: <Trophy size={40} fill="#FFD700" color="#FFD700" />,
  2: <Medal size={36} fill="#C0C0C0" color="#C0C0C0" />,
  3: <Award size={36} fill="#CD7F32" color="#CD7F32" />,
};
const rankColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
const fallbackColor = '#d4af37';

// Toont de spel-naam (RTL voor Arabisch) + eventuele subtitel + klas
function GameLine({ student }) {
  const rtl = /[؀-ۿ]/.test(student.game);
  return (
    <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>
      {rtl ? <span dir="rtl">{student.game}</span> : student.game}
      {student.gameSubtitle ? ` — ${student.gameSubtitle}` : ''}
      {student.klas ? ` — ${student.klas}` : ''}
    </span>
  );
}

// Volledig spel in beeld (iframe, of de Race-of-Peace component) + Terug-knop
function GameView({ gameKey, onBack }) {
  const g = GAMES[gameKey] || {};
  const accent = g.accent || fallbackColor;
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute', top: '1rem', left: '1rem', zIndex: 100,
          background: 'rgba(0, 0, 0, 0.8)', border: `2px solid ${accent}`, color: accent,
          padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontFamily: 'sans-serif',
        }}
      >
        <ArrowLeft size={18} />
        Terug
      </button>
      {g.component ? (
        <IslamicRacingGame />
      ) : (
        <iframe src={g.src} style={{ width: '100%', height: '100%', border: 'none' }} title={g.title || gameKey} />
      )}
    </div>
  );
}

function App() {
  const [page, setPage] = useState('home');
  const [lichting, setLichting] = useState('lichting3');

  if (page !== 'home') {
    return <GameView gameKey={page} onBack={() => setPage('home')} />;
  }

  const L = LICHTINGEN[lichting];
  const top3 = L.students.filter((s) => s.rank <= 3);
  const honorable = L.students.filter((s) => s.rank >= 4);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a0f0a 0%, #2d1a10 50%, #1a0f0a 100%)',
      fontFamily: '"Amiri", "Scheherazade New", serif',
      color: '#f4e3b5',
    }}>
      {/* Hero */}
      <header style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '400px', overflow: 'hidden' }}>
        <img className="hero-img" src="/school.png" alt="Al Qalam School"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,15,10,0.3) 0%, rgba(26,15,10,0.7) 70%, #1a0f0a 100%)' }} />
        <div className="hero-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '90%', maxWidth: '800px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
            background: 'linear-gradient(135deg, #d4af37, #f4e3b5, #d4af37)', backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem', letterSpacing: '0.05em',
          }}>
            Qalam Games
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#f4e3b5', opacity: 0.9, letterSpacing: '0.1em' }}>
            Programmeren met AI
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Intro */}
        <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Code size={32} color="#d4af37" />
            <Sparkles size={32} color="#d4af37" />
            <Gamepad2 size={32} color="#d4af37" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#d4af37', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            Wat is Qalam Games?
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 1.5rem', opacity: 0.9 }}>
            Bij Qalam Games leren leerlingen van <strong style={{ color: '#d4af37' }}>groep 6, 7 en 8</strong> hoe
            ze hun eigen spellen kunnen maken met behulp van <strong style={{ color: '#d4af37' }}>kunstmatige intelligentie (AI)</strong>.
          </p>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.8, maxWidth: '700px', margin: '0 auto 1.5rem', opacity: 0.9 }}>
            Leerlingen ontdekken hoe ze met AI kunnen samenwerken om echte, werkende games te bouwen.
            Geen ervaring nodig — alleen creativiteit en nieuwsgierigheid!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {['Groep 6', 'Groep 7', 'Groep 8'].map((groep) => (
              <div key={groep} style={{
                padding: '1rem 2rem', border: '2px solid rgba(212, 175, 55, 0.4)', borderRadius: '12px',
                background: 'rgba(212, 175, 55, 0.1)', fontSize: '1.2rem', fontWeight: 600, color: '#d4af37', letterSpacing: '0.1em',
              }}>
                {groep}
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', margin: '0 auto 3rem' }} />

        {/* Lichting-tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {TAB_ORDER.map((key) => {
            const active = key === lichting;
            return (
              <button
                key={key}
                onClick={() => setLichting(key)}
                style={{
                  padding: '0.8rem 2rem', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'inherit',
                  borderRadius: '12px', cursor: 'pointer', letterSpacing: '0.05em',
                  border: '2px solid #d4af37',
                  background: active ? 'linear-gradient(135deg, #d4af37, #f4e3b5)' : 'transparent',
                  color: active ? '#1a0f0a' : '#d4af37',
                  boxShadow: active ? '0 0 22px rgba(212, 175, 55, 0.45)' : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {LICHTINGEN[key].label}
              </button>
            );
          })}
        </div>

        {/* Lichting-subtitel + sectiekop */}
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.05rem', opacity: 0.75, marginBottom: '2rem', fontStyle: 'italic' }}>
            {L.subtitle}
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#d4af37', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            {L.heading}
          </h2>
          <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '2.5rem' }}>
            {L.headingSub}
          </p>

          {/* Top 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '620px', margin: '0 auto' }}>
            {top3.map((student) => (
              <div key={student.rank} style={{
                display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem',
                background: 'rgba(58, 35, 20, 0.6)', border: `2px solid ${rankColors[student.rank]}40`,
                borderRadius: '14px', boxShadow: `0 0 20px ${rankColors[student.rank]}15`,
              }}>
                <div style={{ flexShrink: 0 }}>{rankIcons[student.rank]}</div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: rankColors[student.rank], marginBottom: '0.2rem' }}>
                    {student.name}
                  </div>
                  <GameLine student={student} />
                </div>
                {L.scored && student.score && (
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: rankColors[student.rank], flexShrink: 0 }}>
                    {student.score}
                  </div>
                )}
                {student.playable && (
                  <button
                    onClick={() => setPage(student.playable)}
                    style={{
                      padding: '0.5rem 1rem', fontSize: '0.95rem', fontWeight: 700, border: '2px solid #d4af37',
                      background: 'linear-gradient(135deg, #d4af37, #f4e3b5)', color: '#1a0f0a', cursor: 'pointer',
                      borderRadius: '8px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
                    }}
                  >
                    <Gamepad2 size={16} />
                    Speel
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Eervolle vermelding */}
        {honorable.length > 0 && (
          <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: '#f4e3b5', marginBottom: '1.5rem', letterSpacing: '0.05em', opacity: 0.8 }}>
              Eervolle vermelding
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '620px', margin: '0 auto' }}>
              {honorable.map((student) => (
                <div key={student.rank} style={{
                  display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1rem 1.5rem',
                  background: 'rgba(58, 35, 20, 0.4)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '14px',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', opacity: 0.5, flexShrink: 0, width: '40px' }}>
                    #{student.rank}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4e3b5', marginBottom: '0.2rem' }}>
                      {student.name}
                    </div>
                    <GameLine student={student} />
                  </div>
                  {L.scored && student.score && (
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#d4af37', opacity: 0.8, flexShrink: 0 }}>
                      {student.score}
                    </div>
                  )}
                  {student.playable && (
                    <button
                      onClick={() => setPage(student.playable)}
                      style={{
                        padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 700, border: '2px solid rgba(212, 175, 55, 0.5)',
                        background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', cursor: 'pointer', borderRadius: '8px',
                        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0,
                      }}
                    >
                      <Gamepad2 size={14} />
                      Speel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', opacity: 0.6, fontSize: '0.9rem' }}>
        Qalam Games — Al Qalam School
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap');
        @media (max-width: 600px) {
          .hero-img { object-position: 30% 35% !important; transform: scale(1.4); transform-origin: 30% 35%; }
          .hero-text { top: 40% !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
