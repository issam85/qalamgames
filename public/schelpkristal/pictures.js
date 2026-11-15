// Plaatjes voor kinderen die (nog) niet lezen: van elk ding in het kleedhokje een kleine
// tekening uit de prinses zelf in haar eigen kleuren, iconen op bestaande knoppen en
// meldingen zonder woorden (pictureNote). De iconen zelf staan in icons.js.
import { princessSvg, swimSvg } from './princess.js';
import { HAIR_STYLES } from './data.js';
import { BUTTON_ICONS } from './icons.js';

// welk stuk van de prinses je ziet in het plaatje van een ding (vak 300 × 520)
const CROPS = {
  jurk: '40 160 220 360',
  patroon: '40 160 220 360',
  kroon: '100 18 100 82',
  ketting: '104 168 92 76',
  schoenen: '84 448 132 70',
  zwem: '70 150 160 370',
  hood: '80 40 140 170',
  haar: '50 0 200 340',
  gezicht: '100 60 100 110',
  oorbellen: '88 88 124 90',
  armband: '56 280 72 64',
  speld: '96 14 140 130',
};

// zonder role="img": het plaatje staat op een knop die zelf een naam heeft
const quiet = (svgText) => svgText.replace(' role="img"', ' aria-hidden="true"');
const crop = (svgText, box) => svgText.replace(/viewBox="[^"]*"/, `viewBox="${box}"`);

// een tekening van de prinses met ding i van deze soort, in haar eigen kleuren
export function itemPicture(cat, i, princess, outfit) {
  if (cat === 'haar') return quiet(princessSvg(princess, outfit, '', CROPS.haar, { style: HAIR_STYLES[i].key }));
  const tryOn = { ...outfit, choice: { ...outfit.choice, [cat]: i } };
  if (cat === 'zwem') return quiet(crop(swimSvg(princess, tryOn), CROPS.zwem));
  return quiet(princessSvg(princess, tryOn, '', CROPS[cat]));
}

// het hoofd in de burkini, met of zonder capuchon
export const hoodPicture = (princess, outfit, hood) => quiet(crop(swimSvg(princess, { ...outfit, hood }), CROPS.hood));

// even een ander haar of gezicht (look = { style }, { mouth }, …) voor het plaatje
export const lookPicture = (cat, princess, outfit, look) => quiet(princessSvg(princess, outfit, '', CROPS[cat], look));

// zet een icoon vóór de tekst van een bestaande knop (beginscherm, Klaar, Terug)
export function decorate(el, name) {
  const label = el.textContent.trim();
  el.innerHTML = `<span class="pic">${BUTTON_ICONS[name]}</span><span class="name">${label}</span>`;
  el.classList.add('with-pic');
  el.setAttribute('aria-label', label);
}

// Een melding in plaatjes: parts zijn stukjes HTML (een tekening, een icoon) of knoppen.
// text = dezelfde melding in woorden, voor wie voorleest of een schermlezer gebruikt.
export function pictureNote(el, parts, text = '') {
  const span = (className, html) => {
    const s = document.createElement('span');
    s.className = className;
    s.innerHTML = html;
    return s;
  };
  el.replaceChildren(...parts.map((part) => (typeof part === 'string' ? span('note-part', part) : part)));
  if (text) el.append(Object.assign(span('sr', ''), { textContent: text }));
}

// een icoon met een getal ernaast: schelp, kristal of parel (zoals bovenin de balk)
export const countPart = (kind, n) => `<span class="ico ${kind}" aria-hidden="true"></span><b>${n}</b>`;
