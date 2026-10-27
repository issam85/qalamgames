import { Sparkles, Code, Gamepad2 } from 'lucide-react';
import '../styles/sections.css';

const STEPS = [
  { Icon: Sparkles, tone: 'gold', label: 'Stap 1', title: 'Bedenk je spel', text: 'Een race, een quiz of een avontuur: de leerling kiest het idee en de regels.' },
  { Icon: Code, tone: 'blue', label: 'Stap 2', title: 'Bouw het met AI', text: 'Samen met AI wordt het idee een echt, werkend spel dat in de browser draait.' },
  { Icon: Gamepad2, tone: 'green', label: 'Stap 3', title: 'Speel en deel', text: 'Het spel komt op deze site, met een eigen link om te delen.' },
];

export default function About() {
  return (
    <section id="over" className="section container">
      <div className="about">
        <div className="about-text">
          <h2 className="section-title">Wat is Qalam Games?</h2>
          <p className="about-lead">
            Bij Qalam Games leren leerlingen van groep 6, 7 en 8 hoe ze hun eigen spellen kunnen maken met
            behulp van kunstmatige intelligentie (AI). Ze ontdekken hoe ze met AI kunnen samenwerken om echte,
            werkende games te bouwen.
          </p>
          <div className="chips">
            {['Groep 6', 'Groep 7', 'Groep 8'].map((groep) => (
              <span key={groep} className="chip">{groep}</span>
            ))}
          </div>
          <p className="about-note">Geen ervaring nodig — alleen creativiteit en nieuwsgierigheid!</p>
        </div>
        <div className="about-photo">
          <img src="/school.webp" alt="Basisschool Al Qalam in Gouda" />
        </div>
      </div>
      <div className="steps">
        {STEPS.map(({ Icon, tone, label, title, text }) => (
          <div key={title} className="step">
            <span className={`step-icon tone-${tone}`}><Icon size={28} aria-hidden="true" /></span>
            <span className={`step-label tone-${tone}`}>{label}</span>
            <h3 className="step-title">{title}</h3>
            <p className="step-text">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
