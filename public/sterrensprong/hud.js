// Alles boven het 3D-beeld: voortgang met checkpoint-ruitjes, pogingen, flits, eindscherm en pauze.
import { ICONS } from './icons.js';

const $ = (id) => document.getElementById(id);

export const percentOf = (run) => Math.min(100, Math.floor((run.x / run.level.length) * 100));

const shown = {}; // wat er nu staat: alleen bij een verandering naar de pagina schrijven

function changed(key, value) {
  if (shown[key] === value) return false;
  shown[key] = value;
  return true;
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
export function showWorldDone(level, next, practice, count) {
  const times = count === 1 ? 'in één keer!' : `in ${count} pogingen`;
  if (practice) showOverlay('Oefenen gehaald!', `${times} · nu echt, vanaf de gouden checkpoints`, 'Start');
  else if (!next) showOverlay('Alles gehaald!', `${level.name} ${times}`, null);
  else showOverlay(`${level.name} gehaald!`, `${times} · volgende: ${next.name}`, `Naar ${next.name}`);
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
