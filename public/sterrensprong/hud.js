// Alles boven het 3D-beeld: voortgang, pogingen, flits en meldingen.
const $ = (id) => document.getElementById(id);

export const percentOf = (run) => Math.min(100, Math.floor((run.x / run.level.length) * 100));

export function updateHud(run, attempt, practice, best) {
  const percent = percentOf(run);
  $('bar-fill').style.width = `${percent}%`;
  $('bar-best').style.left = `${best}%`;
  $('bar-best').hidden = practice || best === 0 || best === 100;
  $('percent').textContent = `${percent}%`;
  $('attempt').textContent = practice ? `${run.level.name} · oefenen` : `${run.level.name} · poging ${attempt}`;
}

// bij 100%: de wereld is klaar, de volgende gaat open
export function showWorldDone(level, next, practice) {
  let title = `${level.name} gehaald!`;
  let text = `Druk op spatie of tik voor ${next?.name}`;
  if (practice) {
    title = 'Oefenen gehaald!';
    text = 'Druk op spatie of tik om terug te gaan. Nu nog echt, zonder checkpoints!';
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
