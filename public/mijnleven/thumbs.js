// Plaatjes voor de knoppen van de kast en de winkel: één stuk kleding in de gekozen
// kleur, uit dezelfde tekeningen als het meisje (doll-parts.js), ingezoomd op waar
// het zit. Hoofddoek, sieraden en extra's staan op een hoofd, hals of hand, anders
// herken je ze niet. Elk plaatje gaat door scoped(), zodat de verlopen niet botsen.
import { JURK, HOOFDDOEK, SCHOENEN, TAS, SIERADEN, EXTRA, GOWN, gownTop } from './doll-parts.js';
import { face, hand, soft } from './doll.js';
import { paint, defs, scoped, SKIN_PAINT } from './glans.js';
import { NECKLACES } from './data.js';

// "Geen": een leeg rondje met een streep
export const NONE_ICON = '<svg viewBox="-24 -24 48 48" aria-hidden="true"><circle r="15" fill="#fff" stroke="#c9b8d8" stroke-width="4"/><path d="M-10 10 L10 -10" stroke="#c9b8d8" stroke-width="4" stroke-linecap="round"/></svg>';

const LILAC = paint('#e9d5ff');
// een hals met schouders in een lichte blouse, voor kettingen en de broche
const NECK = `<rect x="136" y="150" width="28" height="56" fill="${SKIN_PAINT.fill}"/>`
  + `<path d="M96 290 C98 240 104 206 128 198 Q150 214 172 198 C196 206 202 240 204 290 Z" fill="${LILAC.fill}" stroke="${LILAC.line}" stroke-width="1.5"/>`;
// een hoofd met een eenvoudige hoofddoek, voor de extra's
const HEAD = () => HOOFDDOEK[0](LILAC) + face();
const WRIST = `<path d="M118 204 C100 250 92 290 90 322" fill="none" stroke="${LILAC.fill}" stroke-width="30" stroke-linecap="round"/>${hand(90)}`;

// per categorie: welk stuk van het vak (viewBox), wat eronder en wat erboven komt
const VIEW = {
  hoofddoek: () => ['66 52 168 168', '', (p, i) => HOOFDDOEK[i](p) + face()],
  jurk: (i) => ['28 186 244 336', '', (p) => JURK[i](p) + (i === GOWN ? gownTop(p) : '')],
  schoenen: () => ['86 440 128 80', '', (p, i) => SCHOENEN[i](p)],
  tas: () => ['160 304 110 140', '', (p, i) => TAS[i](p)],
  sieraden: (i) => (NECKLACES.includes(i) || i === 5 ? [i === 6 ? '104 184 92 92' : '110 186 80 66', NECK] : ['60 290 64 60', WRIST])
    .concat((p) => SIERADEN[i](p)),
  extra: (i) => (i === 4 ? ['54 288 74 104', WRIST] : ['70 26 160 160', HEAD()]).concat((p) => EXTRA[i](p)),
};

const cache = new Map();

// cat = categorie, i = soort, color = kleur
export function itemThumb(cat, i, color) {
  const key = `${cat}:${i}:${color}`;
  if (!cache.has(key)) {
    const empty = (cat === 'tas' && i === 5) || ((cat === 'sieraden' || cat === 'extra') && i === 0);
    const p = paint(soft(color));
    const [view, under, draw] = empty ? [] : VIEW[cat](i);
    cache.set(key, empty ? NONE_ICON
      : `<svg viewBox="${view}" aria-hidden="true">${defs([p, LILAC])}${under}${draw(p, i)}</svg>`);
  }
  return scoped(cache.get(key));
}

// het plaatje voor een categorie: de eerste soort die iets is, in jouw kleur
export const catThumb = (cat, color) => itemThumb(cat, cat === 'sieraden' || cat === 'extra' ? 1 : 0, color);
