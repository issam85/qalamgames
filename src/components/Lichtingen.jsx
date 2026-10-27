import { useState } from 'react';
import GameCard from './GameCard';
import { LICHTINGEN } from '../data/lichtingen';
import '../styles/lichtingen.css';

function CardGrid({ entries }) {
  return (
    <div className="card-grid">
      {entries.map((entry) => <GameCard key={entry.game} entry={entry} />)}
    </div>
  );
}

export default function Lichtingen() {
  const [activeId, setActiveId] = useState(LICHTINGEN[0].id);
  const active = LICHTINGEN.find((l) => l.id === activeId);
  const ranked = active.rest.length > 0;

  // Kies een tab en schuif hem in beeld (op mobiel staan de tabs in een schuifbare rij)
  const select = (id) => {
    setActiveId(id);
    document.getElementById(`tab-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  // Pijltjes links/rechts wisselen tussen tabs (toegankelijk tab-patroon)
  const onKeyDown = (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    const i = LICHTINGEN.findIndex((l) => l.id === activeId);
    const next = LICHTINGEN[(i + step + LICHTINGEN.length) % LICHTINGEN.length];
    select(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section id="lichtingen" className="section container lichtingen">
      <div className="lichtingen-head">
        <h2 className="section-title">Alle spellen per lichting</h2>
        <p className="lichtingen-sub">{active.subtitle}</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Lichtingen" onKeyDown={onKeyDown}>
        {LICHTINGEN.map((l) => (
          <button
            key={l.id}
            id={`tab-${l.id}`}
            type="button"
            role="tab"
            aria-selected={l.id === activeId}
            aria-controls="lichting-panel"
            tabIndex={l.id === activeId ? 0 : -1}
            className="tab"
            onClick={() => select(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div id="lichting-panel" role="tabpanel" aria-labelledby={`tab-${activeId}`}>
        {ranked && <h3 className="group-title">Top 3</h3>}
        <CardGrid entries={active.top} />
        {ranked && (
          <>
            <h3 className="group-title">Eervolle vermeldingen</h3>
            <CardGrid entries={active.rest} />
          </>
        )}
      </div>
    </section>
  );
}
