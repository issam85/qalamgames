// HUD van de sprint: links boven per loper een portret, de tijd en een kleine power bar;
// onderin voor elke speler een grote power bar met de toets en een "TURBO!"-melding.
import { TURBO_AT } from './sprint-momentum.js';
import { KEY_LABELS, TOUCH } from './sprint-input.js';

function el(tag, cls, parent) {
  const node = document.createElement(tag);
  node.className = cls;
  parent.appendChild(node);
  return node;
}

function row(player, root) {
  const r = el('div', 'shud-row', root);
  r.style.setProperty('--accent', player.character.color);
  const face = el('div', 'shud-face', r);
  const img = el('img', '', face);
  img.src = `img/${player.character.key}.png`;
  img.alt = '';
  const info = el('div', 'shud-info', r);
  const top = el('div', 'shud-top', info);
  el('span', 'shud-name', top).textContent = player.control === 'CPU' ? player.character.name : player.control.replace('Speler ', 'P');
  const time = el('span', 'shud-time', top);
  const bar = el('div', 'shud-bar', info);
  const fill = el('div', 'shud-fill', bar);
  el('div', 'shud-mark', bar).style.left = `${TURBO_AT * 100}%`;
  return { el: r, time, fill };
}

// grote meter onderin voor een menselijke speler
function gauge(player, side, stage, humans) {
  const g = el('div', `shud-gauge is-${side}`, stage);
  g.style.setProperty('--accent', player.character.color);
  const tag = player.control.replace('Speler ', 'P');
  const key = TOUCH ? (humans > 1 ? `TIK ${side === 'left' ? 'LINKS' : 'RECHTS'}` : 'TIK OP HET SCHERM') : KEY_LABELS[player.control];
  el('div', 'shud-gauge-label', g).textContent = `${tag} · POWER · ${key}`;
  const bar = el('div', 'shud-gauge-bar', g);
  const fill = el('div', 'shud-fill', bar);
  el('div', 'shud-mark', bar).style.left = `${TURBO_AT * 100}%`;
  el('div', 'shud-turbo', g).textContent = 'TURBO!';
  return { el: g, fill };
}

export function createHud(stage, players) {
  const root = el('div', 'shud', stage);
  const rows = players.map((p) => row(p, root));
  const humans = players.map((p, i) => (p.control === 'CPU' ? -1 : i)).filter((i) => i >= 0);
  const gauges = humans.map((i, n) => ({ idx: i, ...gauge(players[i], n === 0 ? 'left' : 'right', stage, humans.length) }));
  return { root, rows, gauges };
}

function setPower(fill, power) {
  fill.style.clipPath = `inset(0 ${(100 - power * 100).toFixed(1)}% 0 0)`;
}

// time = speltijd sinds GO; finishers houden hun eindtijd; done = race voorbij
export function updateHud(hud, runners, time, done) {
  runners.forEach((r, i) => {
    const row = hud.rows[i];
    const out = done && r.finishTime === undefined;
    row.time.textContent = out ? '—' : (r.finishTime ?? time).toFixed(2);
    row.el.classList.toggle('is-out', out);
    setPower(row.fill, r.momentum.power);
    row.el.classList.toggle('is-turbo', r.momentum.turbo && r.finishTime === undefined);
    row.el.classList.toggle('is-done', r.finishTime !== undefined);
  });
  hud.gauges.forEach((g) => {
    const r = runners[g.idx];
    setPower(g.fill, r.momentum.power);
    g.el.classList.toggle('is-turbo', r.momentum.turbo && r.finishTime === undefined);
    g.el.classList.toggle('is-done', r.finishTime !== undefined || done);
  });
}

export function removeHud(hud) {
  hud.root.remove();
  hud.gauges.forEach((g) => g.el.remove());
}
