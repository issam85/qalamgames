// Uitleg op het startscherm: toetsen (1 of 2 spelers) of de aanraakknoppen.
const ROWS = [
  ['lopen', 'WASD', 'pijltjes'],
  ['sprinten', 'Shift', 'rechter Shift'],
  ['schieten (vasthouden)', 'F', 'Enter'],
  ['passen', 'Spatie', '/'],
  ['lob', 'R', '.'],
  ['tackle', 'E', "'"],
  ['om de bal roepen', 'Q', '\\'],
];

const kbd = (k) => `<kbd>${k}</kbd>`;

function keys(count) {
  if (count === 1) return `<ul class="keylist">${ROWS.map(([what, k]) => `<li>${kbd(k)}${what}</li>`).join('')}</ul>`;
  const rows = ROWS.map(([what, a, b]) => `<tr><td>${what}</td><td>${kbd(a)}</td><td>${kbd(b)}</td></tr>`).join('');
  return `<table class="keytable"><tr><th></th><th class="p1">P1</th><th class="p2">P2</th></tr>${rows}</table>`;
}

function touch(count) {
  const half = count > 1 ? '<p>Ieder heeft een eigen helft van het scherm: <b class="p1">P1</b> links, <b class="p2">P2</b> rechts.</p>' : '';
  return `${half}<ul class="keylist touchlist">
    <li>${kbd('Links')}sleep met je duim om te lopen</li>
    <li>${kbd('Schiet')}vasthouden = harder</li>
    <li>${kbd('Pas')}naar een teamgenoot</li>
    <li>${kbd('Lob')}hoog over iemand heen</li>
    <li>${kbd('Tackle')}de bal afpakken</li>
    <li>${kbd('Sprint')}vasthouden = rennen</li></ul>`;
}

export function helpHtml(count) {
  const intro = count === 1
    ? '<p>Jij bent <b class="p1">P1</b> en speelt met twee teamgenoten.</p>'
    : '<p>Jullie zijn <b class="p1">P1</b> en <b class="p2">P2</b> in één team, met een teamgenoot.</p>';
  const touchMode = document.body.classList.contains('touch');
  return `${intro}${touchMode ? touch(count) : keys(count)}`;
}

// de regel onderin tijdens het spelen
export function keysLine(count) {
  if (count === 1) return 'WASD lopen · Shift sprint · F vasthouden = schieten · Spatie pass · R lob · E tackle · Q roepen';
  return 'P1: WASD · Shift · F · Spatie · R · E — P2: pijltjes · rechter Shift · Enter · / · . · \'';
}
