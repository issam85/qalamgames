// De tekeningen van de kleren, als SVG-stukjes in een vak van 300 × 520. Per
// categorie één functie per soort (zelfde volgorde als in data.js); c = de kleur.
const A_LINE = 'M110 150 L190 150 L240 500 L60 500 Z';
const HIJAB = 'M150 40 C95 40 80 95 86 150 C90 180 105 200 110 160 L190 160 C195 200 210 180 214 150 C220 95 205 40 150 40 Z';
const STAR = 'l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z';
const dots = (list, r) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('');
// links en rechts hetzelfde: de tweede is 62 opgeschoven
const pair = (one) => `${one}<g transform="translate(62 0)">${one}</g>`;

export const JURK = [
  (c) => `<path d="${A_LINE}" fill="${c}"/>`,
  (c) => `<path d="${A_LINE}" fill="${c}"/><g fill="#fff" opacity="0.85">${dots([[120, 260], [175, 310], [110, 390], [190, 430], [150, 360], [140, 230]], 8)}</g>`,
  (c) => `<path d="M112 150 L188 150 L196 300 L104 300 Z" fill="#fff"/><path d="M100 300 L200 300 L240 500 L60 500 Z" fill="${c}"/>`,
  (c) => `<path d="M110 150 L190 150 L270 500 L30 500 Z" fill="${c}"/><g fill="#ffd43b"><path d="M120 280 ${STAR}"/><path d="M190 350 ${STAR}"/><path d="M135 440 ${STAR}"/></g>`,
  (c) => `<path d="${A_LINE}" fill="${c}"/><g fill="#fff" opacity="0.55"><rect x="100" y="220" width="100" height="14"/><rect x="91" y="280" width="118" height="14"/><rect x="83" y="340" width="134" height="14"/><rect x="74" y="400" width="152" height="14"/><rect x="66" y="460" width="168" height="14"/></g>`,
  (c) => `<path d="${A_LINE}" fill="#fff"/><path d="M110 150 L140 150 L122 500 L60 500 Z" fill="${c}"/><path d="M190 150 L160 150 L178 500 L240 500 Z" fill="${c}"/>`,
];

export const HOOFDDOEK = [
  (c) => `<path d="${HIJAB}" fill="${c}"/>`,
  (c) => `<path d="${HIJAB}" fill="${c}"/><path d="M200 60 l20-18 4 22 18-6-14 20 16 10-24 2" fill="${c}" stroke="#fff" stroke-width="3"/>`,
  (c) => `<path d="M150 40 C95 40 80 95 86 150 C84 230 92 300 100 330 L200 330 C208 300 216 230 214 150 C220 95 205 40 150 40 Z" fill="${c}"/>`,
  (c) => `<path d="M150 36 C100 36 84 80 90 130 L210 130 C216 80 200 36 150 36 Z" fill="${c}"/><path d="M92 100 C120 80 180 80 208 100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`,
  (c) => `<path d="${HIJAB}" fill="${c}"/><g fill="#fff">${dots([[200, 58], [214, 68], [210, 84], [194, 84], [188, 68]], 9)}</g><circle cx="201" cy="72" r="8" fill="#ffd43b"/>`,
  (c) => `<path d="${HIJAB}" fill="${c}"/><ellipse cx="150" cy="104" rx="47" ry="56" fill="#fff"/>`,
];

export const SCHOENEN = [
  (c) => pair(`<rect x="96" y="486" width="46" height="22" rx="10" fill="${c}"/><rect x="96" y="500" width="46" height="6" fill="#fff"/>`),
  (c) => pair(`<ellipse cx="119" cy="498" rx="24" ry="10" fill="${c}"/><circle cx="119" cy="492" r="4" fill="#fff"/>`),
  (c) => pair(`<rect x="98" y="450" width="42" height="58" rx="10" fill="${c}"/>`),
  (c) => pair(`<rect x="96" y="496" width="46" height="12" rx="6" fill="${c}"/><path d="M104 496 L120 480 L136 496" fill="none" stroke="${c}" stroke-width="5"/>`),
  (c) => pair(`<path d="M100 490 L142 502 L142 508 L112 508 Z" fill="${c}"/><rect x="100" y="490" width="7" height="18" fill="${c}"/>`),
  (c) => pair(`<rect x="94" y="500" width="50" height="8" rx="4" fill="${c}"/><rect x="110" y="490" width="22" height="10" rx="5" fill="${c}"/>`),
];

export const TAS = [
  (c) => `<rect x="228" y="300" width="54" height="64" rx="14" fill="${c}"/><path d="M240 300 C240 280 270 280 270 300" fill="none" stroke="${c}" stroke-width="7"/><rect x="238" y="330" width="34" height="8" rx="4" fill="#fff" opacity="0.8"/>`,
  (c) => `<path d="M228 310 L282 310 L276 370 L234 370 Z" fill="${c}"/><path d="M236 310 C236 290 274 290 274 310" fill="none" stroke="${c}" stroke-width="6"/><circle cx="255" cy="340" r="6" fill="#ffd43b"/>`,
  (c) => `<path d="M196 150 L246 330" fill="none" stroke="${c}" stroke-width="6"/><rect x="226" y="326" width="56" height="44" rx="12" fill="${c}"/>`,
  (c) => `<rect x="204" y="330" width="48" height="28" rx="8" fill="${c}"/><circle cx="228" cy="344" r="4" fill="#ffd43b"/>`,
  (c) => `<rect x="224" y="312" width="62" height="78" rx="6" fill="${c}"/><path d="M236 312 C236 286 274 286 274 312" fill="none" stroke="${c}" stroke-width="5"/><path d="M246 340 ${STAR}" fill="#fff" opacity="0.85"/>`,
  () => '',
];

export const SIERADEN = [
  () => '',
  (c) => `<path d="M126 166 Q150 196 174 166" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="186" r="8" fill="${c}" stroke="#fff" stroke-width="2"/>`,
  (c) => `<g fill="${c}" stroke="#fff" stroke-width="1.5">${dots([[126, 168], [134, 177], [143, 183], [153, 184], [163, 180], [171, 172]], 5)}</g>`,
  (c) => `<g fill="none" stroke="${c}" stroke-width="5"><ellipse cx="82" cy="312" rx="12" ry="5"/><ellipse cx="218" cy="312" rx="12" ry="5"/></g>`,
  (c) => `<rect x="70" y="304" width="24" height="12" rx="4" fill="${c}"/><circle cx="82" cy="310" r="8" fill="#fff" stroke="${c}" stroke-width="3"/><path d="M82 306v4h3" fill="none" stroke="#3a2a4d" stroke-width="1.5"/>`,
  (c) => `<path d="M126 196 ${STAR}" fill="${c}" stroke="#fff" stroke-width="2"/>`,
];

export const EXTRA = [
  () => '',
  (c) => `<g fill="${c}"><rect x="120" y="90" width="26" height="18" rx="8"/><rect x="154" y="90" width="26" height="18" rx="8"/><rect x="144" y="96" width="12" height="4"/></g>`,
  (c) => `<g fill="none" stroke="${c}" stroke-width="3"><circle cx="134" cy="100" r="12"/><circle cx="166" cy="100" r="12"/><path d="M146 100h8"/></g>`,
  (c) => `<path d="M118 48 L126 18 L140 38 L150 12 L160 38 L174 18 L182 48 Z" fill="${c}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>`,
  (c) => `<path d="M80 330 L74 380" stroke="#3c9a46" stroke-width="5"/><g fill="${c}">${dots([[68, 312], [86, 306], [92, 322]], 10)}</g><circle cx="76" cy="326" r="10" fill="#fff"/>`,
  (c) => `<g fill="${c}" stroke="#fff" stroke-width="3" stroke-linejoin="round"><path d="M150 44 L122 28 L122 60 Z"/><path d="M150 44 L178 28 L178 60 Z"/><circle cx="150" cy="44" r="7"/></g>`,
];
