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

const PRESS = { p1: 'F of spatie', p2: 'Enter of /' };

function penaltyText(match, kick, touch) {
  const two = match.players.filter((p) => !p.cpu).length > 1;
  const who = two ? `${kick.shooter.id.toUpperCase()} · ` : '';
  const how = touch ? 'tik op Schiet' : `druk ${two ? PRESS[kick.shooter.id] : 'F of spatie'}`;
  return `${who}${kick.stage === 'aim' ? 'Richten' : 'Kracht'}: ${how}`;
}

// per echte speler een sprint- en krachtbalk
function meters(match, playing) {
  const humans = match.players.filter((p) => !p.cpu).sort((a, b) => a.id.localeCompare(b.id));
  set('meters', humans.map((p) => p.id).join(), () => {
    $('meters').innerHTML = humans.map((p) => `<div class="mset ${p.id}"><b class="chip">${p.id.toUpperCase()}</b>
      <div class="meter stamina"><span>Sprint</span><div class="track"><div></div></div></div>
      <div class="meter charge"><span>Kracht</span><div class="track"><div></div></div></div></div>`).join('');
    document.body.classList.toggle('two', humans.length > 1);
  });
  if (!playing) return;
  humans.forEach((p) => {
    const box = $('meters').querySelector(`.${p.id}`);
    const [stamina, charge] = box.querySelectorAll('.meter');
    stamina.lastElementChild.firstElementChild.style.width = `${Math.round(p.stamina * 100)}%`;
    stamina.classList.toggle('tired', p.tired);
    charge.classList.toggle('on', p.charging);
    charge.lastElementChild.firstElementChild.style.width = `${Math.round(p.charge * 100)}%`;
  });
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
  const touch = document.body.classList.contains('touch');
  set('penalty', mine ? `${kick.stage}|${kick.shooter.id}|${touch}` : '', () => {
    $('penalty').hidden = !mine;
    if (mine) $('penalty-text').textContent = penaltyText(match, kick, touch);
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
  set('ingame', playing || match.phase === 'penalties', (v) => document.body.classList.toggle('ingame', v));
  penaltyHud(match);
  meters(match, playing);
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
