// Meldingen midden in beeld: een groot plaatje met een kort woord eronder. Ze komen na elkaar
// (minstens 0,8 s per melding); poorten en checkpoints gaan vóór de naam van een nieuw stuk.
const GAP = 800; // ms

let queue = [];
let lastShown = -Infinity;
let timer = 0;

function show({ text, icon }) {
  const element = document.getElementById('toast');
  element.innerHTML = icon ? `<span class="toast-icon">${icon}</span>` : '';
  const words = document.createElement('span');
  words.className = 'toast-text';
  words.textContent = text;
  element.append(words);
  element.classList.toggle('with-icon', Boolean(icon));
  element.classList.remove('on');
  void element.offsetWidth; // laat de animatie opnieuw beginnen
  element.classList.add('on');
  lastShown = performance.now();
}

function next() {
  timer = 0;
  const item = queue.shift();
  if (!item) return;
  show(item);
  if (queue.length) timer = setTimeout(next, GAP);
}

// icon = SVG uit icons.js of hint.js; urgent = vóór de gewone meldingen in de rij
export function showToast(text, icon = '', urgent = false) {
  const item = { text, icon, urgent };
  const at = urgent ? queue.findIndex((q) => !q.urgent) : -1;
  if (at >= 0) queue.splice(at, 0, item);
  else queue.push(item);
  if (timer) return;
  const wait = lastShown + GAP - performance.now();
  if (wait <= 0) next();
  else timer = setTimeout(next, wait);
}

export function clearToasts() {
  queue = [];
  clearTimeout(timer);
  timer = 0;
}
