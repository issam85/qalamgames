// Startscherm en eindscherm (witte kaart over het veld, grote groene knop).
import { clockText } from './clock.js';
import { shootoutScore } from './shootout.js';
import { winnerOf } from './rules.js';
import { helpHtml } from './help.js';

const screen = document.getElementById('screen');
let onButton = null;

function open(html, button, action) {
  screen.innerHTML = `<div class="card">${html}<button class="big" type="button">${button}</button></div>`;
  screen.hidden = false;
  onButton = action;
  screen.querySelector('.big').addEventListener('click', press);
}

function press() {
  if (screen.hidden || !onButton) return;
  screen.hidden = true;
  const action = onButton;
  onButton = null;
  action();
}

// Enter of spatie drukt ook op de knop; 1 en 2 kiezen het aantal spelers
window.addEventListener('keydown', (e) => {
  if (screen.hidden) return;
  if (e.code === 'Digit1' || e.code === 'Digit2') choose(Number(e.code.slice(-1)));
  if (e.code !== 'Enter' && e.code !== 'Space') return;
  e.preventDefault();
  press();
});

let count = 1;

// het aantal spelers kiezen op het startscherm
function choose(n) {
  const help = screen.querySelector('.help');
  if (!help) return;
  count = n;
  help.innerHTML = helpHtml(n);
  screen.querySelectorAll('.choice button').forEach((b) => b.classList.toggle('on', Number(b.dataset.n) === n));
}

// onStart(aantal spelers)
export function showStart(onStart) {
  open(`<h1>OutMatch</h1><p class="sub">3 tegen 3 in de kooi · 1,5 minuut</p>
    <div class="choice"><button type="button" data-n="1">1 speler</button><button type="button" data-n="2">2 spelers</button></div>
    <div class="help"></div><p class="muted">Gelijk na de blessuretijd? Dan penalty's!</p>`, 'Start', () => onStart(count));
  screen.querySelectorAll('.choice button').forEach((b) => b.addEventListener('click', () => choose(Number(b.dataset.n))));
  choose(count);
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
    <div class="final"><span class="team home">${match.players.filter((p) => !p.cpu).length > 1 ? 'Wij' : 'Jij'}</span><b>${match.score.join(' – ')}</b><span class="team away">Gasten</span></div>
    ${pens}${goalLines(match)}`, 'Opnieuw', onAgain);
}
