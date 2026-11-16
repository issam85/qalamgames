// Startscherm en eindscherm (witte kaart over het veld, grote groene knop).
import { clockText } from './clock.js';
import { shootoutScore } from './shootout.js';
import { winnerOf } from './rules.js';

const screen = document.getElementById('screen');
let onButton = null;

function open(html, button, action) {
  screen.innerHTML = `<div class="card">${html}<button class="big" type="button">${button}</button></div>`;
  screen.hidden = false;
  onButton = action;
  screen.querySelector('button').addEventListener('click', press);
}

function press() {
  if (screen.hidden || !onButton) return;
  screen.hidden = true;
  const action = onButton;
  onButton = null;
  action();
}

// Enter of spatie drukt ook op de knop
window.addEventListener('keydown', (e) => {
  if (screen.hidden || (e.code !== 'Enter' && e.code !== 'Space')) return;
  e.preventDefault();
  press();
});

const KEYS = [['WASD', 'lopen'], ['Shift', 'sprinten'], ['F', 'vasthouden = schieten'], ['Spatie', 'passen'],
  ['R', 'lob'], ['E', 'tackle'], ['Q', 'om de bal roepen']];

export function showStart(onStart) {
  const keys = KEYS.map(([k, what]) => `<li><kbd>${k}</kbd>${what}</li>`).join('');
  open(`<h1>OutMatch</h1><p class="sub">3 tegen 3 in de kooi · 1,5 minuut</p>
    <p>Jij bent <b>P1</b> en speelt met twee teamgenoten. Gelijk na de blessuretijd? Dan penalty's!</p>
    <ul class="keylist">${keys}</ul>`, 'Start', onStart);
}

function goalLines(match) {
  if (!match.goals.length) return '<p class="muted">Geen doelpunten</p>';
  return `<ul class="goals">${match.goals.map((g) => `<li class="t${g.team}"><span>${clockText(g.at)}</span>
    ${g.own ? `${g.name} (eigen doelpunt)` : g.name}</li>`).join('')}</ul>`;
}

export function showEnd(match, onAgain) {
  const winner = winnerOf(match);
  const title = winner === 0 ? 'Gewonnen!' : 'Verloren';
  const pens = match.shootout ? `<p class="sub">${shootoutScore(match.shootout).join(' – ')} na penalty's</p>` : '';
  open(`<h1 class="${winner === 0 ? 'win' : 'lose'}">${title}</h1>
    <div class="final"><span class="team home">Jij</span><b>${match.score.join(' – ')}</b><span class="team away">Gasten</span></div>
    ${pens}${goalLines(match)}`, 'Opnieuw', onAgain);
}
