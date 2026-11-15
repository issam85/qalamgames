// De figuren op het strand en in de zee: hun SVG wordt één keer omgezet naar een plaatje op
// een eigen canvas (sneller dan elk beeld de SVG tekenen). De scherpte hangt af van het
// scherm, maar hooguit 1,5 keer: meer ziet een kind niet, en het kost een tablet veel.
import { PRINCESSES, MATCH, defaultOutfit } from './data.js';
import { PRINCES, princeSvg } from './prince.js';
import { princessSvg } from './princess.js';

export const pixelRatio = () => Math.min(1.5, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);

// een SVG als plaatje van w × h (logisch); .ready = true zodra het getekend is
export function sprite(svgText, w, h) {
  const c = document.createElement('canvas');
  const r = pixelRatio();
  c.width = Math.ceil(w * r);
  c.height = Math.ceil(h * r);
  c.ready = false;
  const img = new Image();
  img.onload = () => {
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    c.ready = true;
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  return c;
}

// het vriendinnetje: de eerste prinses die je zelf niet bent, in een paarse glitterjurk
// (uit de standaard, zodat elke nieuwe soort er ook in zit)
export function friendDress() {
  const def = defaultOutfit();
  return {
    ...def,
    choice: { ...def.choice, jurk: 6, kroon: 2, ketting: 1, schoenen: 0 },
    color: { ...def.color, jurk: '#b36bff', kroon: '#ffd43b', ketting: MATCH, schoenen: '#ffd43b' },
  };
}

// de vrienden op het strand, per vriendje { name, sprite }; w × h = maat op het strand
export function makeCrew(princess, w, h) {
  const girl = PRINCESSES.findIndex((_, i) => i !== princess);
  return [
    { name: PRINCES[0].name, sprite: sprite(princeSvg(0), w, h) },
    { name: PRINCESSES[girl].name, sprite: sprite(princessSvg(girl, friendDress(), PRINCESSES[girl].name), w, h) },
    { name: PRINCES[1].name, sprite: sprite(princeSvg(1), w, h) },
  ];
}
