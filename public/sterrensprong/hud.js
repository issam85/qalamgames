// Alles boven het 3D-beeld: voortgang met checkpoint-ruitjes, levens, flits, eindscherm en pauze.
import { START_LIVES } from './tries.js';
import { ICONS, HEART_PATH } from './icons.js';

const $ = (id) => document.getElementById(id);

export const percentOf = (run) => Math.min(100, Math.floor((run.x / run.level.length) * 100));

const HEART = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${HEART_PATH}"/></svg>`;
const shown = {}; // wat er nu staat: alleen bij een verandering naar de pagina schrijven

function changed(key, value) {
  if (shown[key] === value) return false;
  shown[key] = value;
  return true;
}

function updateLives(lives, practice) {
  const box = $('lives');
  if (changed('practice', practice)) box.hidden = practice;
  if (!changed('lives', lives)) return;
  if (!box.children.length) box.innerHTML = HEART.repeat(START_LIVES);
  [...box.children].forEach((heart, i) => heart.classList.toggle('off', i >= lives));
  box.setAttribute('aria-label', `${lives} levens`);
}

// gouden ruitjes op de balk, precies waar de checkpoints van Start liggen
function updateMarks(level, practice, reached) {
  const box = $('marks');
  if (changed('marksFor', practice ? null : level)) {
    box.innerHTML = practice ? '' : level.lifeCheckpoints
      .map((x) => `<i style="left: ${(100 * x) / level.length}%"></i>`).join('');
    shown.reached = null;
  }
  if (!changed('reached', reached)) return;
  [...box.children].forEach((mark, i) => mark.classList.toggle('on', i <= reached));
}

export function updateHud(run, tries, best) {
  const { practice } = tries;
  const percent = percentOf(run);
  updateLives(tries.lives, practice);
  updateMarks(run.level, practice, tries.reached);
  if (changed('percent', percent)) {
    $('bar-fill').style.width = `${percent}%`;
    $('percent').textContent = `${percent}%`;
  }
  const hideBest = practice || best === 0 || best === 100;
  if (changed('best', hideBest ? -1 : best)) {
    $('bar-best').hidden = hideBest;
    $('bar-best').style.left = `${best}%`;
  }
  const text = practice ? `${run.level.name} · oefenen` : `${run.level.name} · poging ${tries.count}`;
  if (changed('attempt', text)) $('attempt').textContent = text;
}

// de twee grote knoppen van het eindscherm en de pauze
$('overlay-go').innerHTML = ICONS.play;
$('overlay-menu').innerHTML = ICONS.home;
$('pause').innerHTML = ICONS.pause;

function showOverlay(title, text, go) {
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay-go').hidden = !go;
  $('overlay-go').setAttribute('aria-label', go || '');
  $('overlay-go').title = go || '';
  $('overlay').hidden = false;
}

// bij 100%; de knoppen werken pas na een korte pauze (setOverlayReady)
export function showWorldDone(level, next, practice) {
  if (practice) showOverlay('Oefenen gehaald!', 'Nu echt, met 5 levens', 'Start');
  else if (!next) showOverlay('Alles gehaald!', 'Alle werelden zijn klaar', null);
  else showOverlay(`${level.name} gehaald!`, `Volgende: ${next.name}`, `Naar ${next.name}`);
  setOverlayReady(false);
}

export function showPause() {
  showOverlay('Pauze', '', 'Verder');
  setOverlayReady(true);
}

export function setOverlayReady(ready) {
  $('overlay-go').disabled = !ready;
  $('overlay-menu').disabled = !ready;
  if (ready && !$('overlay-go').hidden) $('overlay-go').focus({ preventScroll: true });
}

export function hideOverlay() {
  $('overlay').hidden = true;
}

export function flash() {
  const element = $('flash');
  element.classList.remove('on');
  void element.offsetWidth; // laat de animatie opnieuw beginnen
  element.classList.add('on');
}
