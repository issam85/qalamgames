// Alles boven het 3D-beeld: voortgang, pogingen, flits en meldingen.
const $ = (id) => document.getElementById(id);

export function updateHud(run, attempt) {
  const percent = Math.min(100, Math.floor((run.x / run.level.length) * 100));
  $('bar-fill').style.width = `${percent}%`;
  $('percent').textContent = `${percent}%`;
  $('attempt').textContent = `${run.level.name} · poging ${attempt}`;
}

// bij 100%: de wereld is klaar, de volgende gaat open
export function showWorldDone(level, next) {
  $('overlay-title').textContent = next ? `${level.name} gehaald!` : 'Alles gehaald!';
  $('overlay-text').textContent = next
    ? `Druk op spatie of tik voor ${next.name}`
    : 'Druk op spatie of tik om opnieuw te beginnen';
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

// korte naam in beeld als een nieuw stuk van de wereld begint
export function showToast(text) {
  const element = $('toast');
  element.textContent = text;
  element.classList.remove('on');
  void element.offsetWidth;
  element.classList.add('on');
}
