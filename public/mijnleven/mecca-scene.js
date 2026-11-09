// De tekeningen van de reis naar Mekka, in het zwart en goud van het Hajj-spel: de
// tawaf van boven gezien, het Zamzam-water en de sa'i tussen Safa en Marwa.
import { ROUNDS, KAABA, SAFA_X, MARWA_X, journeyStep, towardsMarwa } from './mosque.js';
import { sceneSvg } from './ui.js';

const GOLD = '#d4af37';
const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
const NIGHT = '<rect x="30" y="0" width="240" height="340" rx="14" fill="#060810"/>'
  + `<g fill="#fff" opacity="0.8">${dots([[52, 30], [96, 62], [142, 22], [204, 48], [250, 26], [236, 84], [64, 96], [258, 300], [44, 318]], 1.6)}</g>`;
const title = (text, sub) => `<text x="150" y="34" text-anchor="middle" font-size="18" fill="${GOLD}">${text}</text>`
  + `<text x="150" y="56" text-anchor="middle" font-size="12" fill="#ddd8c4">${sub}</text>`;
// de Kaaba van voren: zwart, met de gouden band en de gouden deur
const kaaba = (x, y, size) => `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" fill="#0c0c0c" stroke="${GOLD}" stroke-width="2"/>`
  + `<rect x="${x - size / 2}" y="${y - size * 0.3}" width="${size}" height="${size * 0.16}" fill="${GOLD}"/>`
  + `<rect x="${x - size * 0.12}" y="${y + size * 0.14}" width="${size * 0.24}" height="${size * 0.36}" fill="none" stroke="${GOLD}" stroke-width="2"/>`;
// jij: een klein figuurtje in het wit met een roze hoofddoek
const pilgrim = (x, y) => `<path d="M${x - 9} ${y + 22} L${x - 6} ${y} H${x + 6} L${x + 9} ${y + 22} Z" fill="#fff"/><circle cx="${x}" cy="${y - 6}" r="8" fill="#ff8ac8"/><circle cx="${x}" cy="${y - 5}" r="4.5" fill="#f1c9a5"/>`;

// anderen die meelopen, op vaste plekken rond de Kaaba
const CROWD = [[0.4, 58], [1.3, 84], [2.2, 62], [3.0, 96], [3.9, 70], [4.8, 88], [5.6, 60], [0.9, 104], [2.7, 108], [4.3, 110]]
  .map(([a, r]) => [KAABA.x + Math.cos(a) * r, KAABA.y + Math.sin(a) * r]);

// where = waar jij loopt (plek in de tekening)
function tawafSvg(mosque, where) {
  const { x, y } = KAABA;
  const far = Math.hypot(where.x - x, where.y - y) || 1;
  const me = { x: x + ((where.x - x) / far) * 76, y: y + ((where.y - y) / far) * 76 };
  return title('Tawaf', `Ronde ${Math.min(ROUNDS, Math.floor(mosque.tawaf) + 1)} van ${ROUNDS}`)
    + `<circle cx="${x}" cy="${y}" r="116" fill="#f3efe2"/><circle cx="${x}" cy="${y}" r="116" fill="none" stroke="${GOLD}" stroke-width="3"/>`
    + `<circle cx="${x}" cy="${y}" r="76" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="6 8" opacity="0.7"/>`
    + `<g fill="#b9b39d">${dots(CROWD, 6)}</g>`
    // de pijl: tegen de klok in
    + `<path d="M${x + 96} ${y - 8} A96 96 0 0 0 ${x + 8} ${y - 96}" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/><path d="M${x + 8} ${y - 96} l14 -7 -2 15 z" fill="${GOLD}"/>`
    + kaaba(x, y, 50) + `<circle cx="${me.x.toFixed(1)}" cy="${me.y.toFixed(1)}" r="11" fill="#ff8ac8" stroke="#fff" stroke-width="3"/>`;
}

function zamzamSvg() {
  return title('Zamzam', 'Tik op de beker en drink het water')
    + `<rect x="92" y="96" width="116" height="150" rx="16" fill="#12141f" stroke="${GOLD}" stroke-width="3"/>`
    + `<text x="150" y="130" text-anchor="middle" font-size="16" fill="${GOLD}">Zamzam</text>`
    + `<rect x="143" y="150" width="14" height="26" rx="5" fill="${GOLD}"/><path d="M150 178 V214" stroke="#8ad8ff" stroke-width="6" stroke-linecap="round"/>`
    + '<path d="M126 214 H174 L168 270 H132 Z" fill="#bfe6ff" stroke="#fff" stroke-width="3"/>';
}

// x = waar jij loopt tussen de twee heuvels
function saiSvg(mosque, x) {
  const hill = (cx, name) => `<path d="M${cx - 44} 262 C${cx - 30} 190 ${cx + 30} 190 ${cx + 44} 262 Z" fill="#6b5a45" stroke="${GOLD}" stroke-width="2"/>`
    + `<text x="${cx}" y="182" text-anchor="middle" font-size="14" fill="${GOLD}">${name}</text>`;
  const to = towardsMarwa(mosque);
  return title("Sa'i", `Keer ${Math.min(ROUNDS, mosque.sai + 1)} van ${ROUNDS}: loop naar ${to ? 'Marwa' : 'Safa'}`)
    + '<rect x="30" y="262" width="240" height="78" fill="#f3efe2"/>'
    + `<rect x="30" y="262" width="240" height="4" fill="${GOLD}"/><rect x="126" y="266" width="48" height="6" fill="#43a047"/>`
    + hill(SAFA_X, 'Safa') + hill(MARWA_X, 'Marwa')
    + `<path d="M${to ? 132 : 168} 232 h${to ? 30 : -30}" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/><path d="M${to ? 168 : 132} 232 l${to ? -10 : 10} -7 v14 z" fill="${GOLD}"/>`
    + pilgrim(x, 276);
}

const DONE = title('Je reis is klaar!', "Tawaf, Zamzam en sa'i: alles gedaan")
  + kaaba(150, 190, 130) + `<g fill="#ffd43b">${dots([[62, 110], [240, 120], [56, 270], [244, 262], [150, 290]], 5)}</g>`;

// where = { x, y }: waar jij loopt in de tekening
export function meccaSvg(mosque, where) {
  const step = journeyStep(mosque);
  let inner = DONE;
  if (step === 'tawaf') inner = tawafSvg(mosque, where);
  else if (step === 'zamzam') inner = zamzamSvg();
  else if (step === 'sai') inner = saiSvg(mosque, where.x);
  return sceneSvg('De reis naar Mekka', NIGHT + inner);
}
