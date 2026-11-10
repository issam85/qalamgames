// Alles boven het 3D-beeld: voortgang, pogingen, flits en meldingen.
import { START_LIVES } from './tries.js';

const $ = (id) => document.getElementById(id);

export const percentOf = (run) => Math.min(100, Math.floor((run.x / run.level.length) * 100));

const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.7-10-9.3C.5 8.2 2.4 4.5 6 4.5c2.2 0 3.9 1.2 6 3.6 2.1-2.4 3.8-3.6 6-3.6 3.6 0 5.5 3.7 4 7.2C19.5 16.3 12 21 12 21z"/></svg>';
let shownLives = -1;

function updateLives(lives, practice) {
  const box = $('lives');
  box.hidden = practice;
  if (lives === shownLives) return;
  if (!box.children.length) box.innerHTML = HEART.repeat(START_LIVES);
  [...box.children].forEach((heart, i) => heart.classList.toggle('off', i >= lives));
  box.setAttribute('aria-label', `${lives} levens`);
  shownLives = lives;
}

export function updateHud(run, tries, best) {
  const { practice } = tries;
  const percent = percentOf(run);
  updateLives(tries.lives, practice);
  document.querySelector('.bar').classList.toggle('marks', !practice);
  $('bar-fill').style.width = `${percent}%`;
  $('bar-best').style.left = `${best}%`;
  $('bar-best').hidden = practice || best === 0 || best === 100;
  $('percent').textContent = `${percent}%`;
  $('attempt').textContent = practice ? `${run.level.name} · oefenen` : `${run.level.name} · poging ${tries.count}`;
}

// bij 100%: de wereld is klaar, de volgende gaat open
export function showWorldDone(level, next, practice) {
  let title = `${level.name} gehaald!`;
  let text = `Druk op spatie of tik voor ${next?.name}`;
  if (practice) {
    title = 'Oefenen gehaald!';
    text = 'Druk op spatie of tik om terug te gaan. Nu nog echt, met 5 levens!';
  } else if (!next) {
    title = 'Alles gehaald!';
    text = 'Druk op spatie of tik om terug te gaan';
  }
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay').hidden = false;
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

// korte tekst midden in beeld, bijvoorbeeld de naam van een nieuw stuk
export function showToast(text) {
  const element = $('toast');
  element.textContent = text;
  element.classList.remove('on');
  void element.offsetWidth;
  element.classList.add('on');
}
