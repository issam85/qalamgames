// Alles boven het 3D-beeld: voortgang, pogingen, flits en de melding bij de finish.
const $ = (id) => document.getElementById(id);

export function updateHud(run, attempt) {
  const percent = Math.min(100, Math.floor((run.x / run.level.length) * 100));
  $('bar-fill').style.width = `${percent}%`;
  $('percent').textContent = `${percent}%`;
  $('attempt').textContent = `Poging ${attempt}`;
}

export function showOverlay(title, text) {
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
