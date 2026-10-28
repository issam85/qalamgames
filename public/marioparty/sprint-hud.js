// HUD van de sprint (links in beeld): per speler een portret, de tijd en een power bar
// waarop je het momentum afleest, met een turbomarkering.
import { TURBO_AT } from './sprint-momentum.js';

function row(player) {
  const el = document.createElement('div');
  el.className = 'shud-row';
  el.style.setProperty('--accent', player.character.color);
  el.innerHTML = `
    <div class="shud-face"><img src="img/${player.character.key}.png" alt=""></div>
    <div class="shud-info">
      <div class="shud-top">
        <span class="shud-name"></span>
        <span class="shud-time">0.00</span>
      </div>
      <div class="shud-bar"><div class="shud-fill"></div><div class="shud-mark"></div></div>
    </div>`;
  el.querySelector('.shud-name').textContent = player.control === 'CPU' ? player.character.name : player.control.replace('Speler ', 'P');
  el.querySelector('.shud-mark').style.left = `${TURBO_AT * 100}%`;
  return {
    el,
    time: el.querySelector('.shud-time'),
    fill: el.querySelector('.shud-fill'),
  };
}

export function createHud(stage, players) {
  const root = document.createElement('div');
  root.className = 'shud';
  const rows = players.map(row);
  rows.forEach((r) => root.appendChild(r.el));
  stage.appendChild(root);
  return { root, rows };
}

// time = seconden sinds GO; finishers houden hun eigen eindtijd; done = race voorbij
export function updateHud(hud, runners, time, done) {
  runners.forEach((r, i) => {
    const row = hud.rows[i];
    const out = done && r.finishTime === undefined;
    row.time.textContent = out ? '—' : (r.finishTime ?? time).toFixed(2);
    row.el.classList.toggle('is-out', out);
    row.fill.style.clipPath = `inset(0 ${(100 - r.momentum.power * 100).toFixed(1)}% 0 0)`;
    row.el.classList.toggle('is-turbo', r.momentum.turbo && r.finishTime === undefined);
    row.el.classList.toggle('is-done', r.finishTime !== undefined);
  });
}

export function removeHud(hud) {
  hud.root.remove();
}
