// Stand, klok en blessuretijd bovenin; uithouding en schietkracht onderin; penalty's en meldingen.
import { clockText } from './clock.js';
import { shootoutScore } from './shootout.js';

const $ = (id) => document.getElementById(id);
const shown = {};

// zet tekst of een eigenschap alleen als die veranderd is (scheelt werk per beeld)
function set(key, value, apply) {
  if (shown[key] === value) return;
  shown[key] = value;
  apply(value);
}

function penaltyHud(match) {
  const { kick, shootout } = match;
  set('pens', shootout ? shootout.kicks.map((k) => k.join('')).join('|') : '', () => {
    $('pens').hidden = !shootout;
    if (!shootout) return;
    [0, 1].forEach((team) => {
      const dots = shootout.kicks[team].map((g) => `<i class="${g ? 'in' : 'out'}"></i>`);
      while (dots.length < 3) dots.push('<i></i>');
      $(`pens${team}`).innerHTML = dots.join('');
    });
    $('score').textContent = shootoutScore(shootout).join(' – ');
  });
  const mine = kick && !kick.shooter.cpu && (kick.stage === 'aim' || kick.stage === 'power');
  set('penalty', mine ? kick.stage : '', (stage) => {
    $('penalty').hidden = !stage;
    $('penalty-text').textContent = stage === 'aim' ? 'Richten: druk F of spatie' : 'Kracht: druk F of spatie';
  });
  if (mine) $('penalty-fill').style.width = `${Math.round((kick.stage === 'power' ? kick.power : 0) * 100)}%`;
}

export function updateHud(match) {
  const playing = match.phase === 'play' || match.phase === 'injury';
  set('score', match.shootout ? null : match.score.join(' – '), (v) => { if (v) $('score').textContent = v; });
  set('clock', clockText(match.time), (v) => { $('clock').textContent = v; });
  set('extra', match.phase === 'injury' ? match.extra : 0, (v) => {
    $('extra').hidden = !v;
    $('extra').textContent = `+${v}`;
  });
  set('playing', playing, (v) => document.body.classList.toggle('playing', v));
  penaltyHud(match);
  const me = match.players.find((p) => p.id === 'p1');
  if (!me || !playing) return;
  $('stamina-fill').style.width = `${Math.round(me.stamina * 100)}%`;
  $('stamina').classList.toggle('tired', me.tired);
  $('charge').classList.toggle('on', me.charging);
  $('charge-fill').style.width = `${Math.round(me.charge * 100)}%`;
}

export function showGoal(text) {
  const el = $('goal');
  el.textContent = text;
  el.classList.remove('show');
  void el.offsetWidth; // animatie opnieuw starten
  el.classList.add('show');
}

let toastTimer = 0;

// korte melding midden in beeld, bv. "Gered!"
export function showToast(text, ms = 900) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}
