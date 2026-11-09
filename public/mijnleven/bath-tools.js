// De spullen in de badkamer: naam, uitleg, bij welke plek ze horen (douche of spiegel)
// en het plaatje dat met je muis of vinger meebeweegt. c = de gekozen make-upkleur.
import { cursorSvg } from './ui.js';

const stick = (len) => `<rect x="-4" y="2" width="8" height="${len}" rx="4" fill="#3a2a4d"/><rect x="-6" y="-4" width="12" height="8" fill="#ffd43b"/>`;

export const TOOLS = [
  { key: 'spons', label: 'Spons', scene: 'douche', hint: 'Sleep de spons over de vlekjes tot alles onder het schuim zit.',
    glyph: () => '<rect x="-24" y="-16" width="48" height="32" rx="10" fill="#ffd43b"/><g fill="#f0b400"><circle cx="-10" cy="-4" r="4"/><circle cx="8" cy="4" r="5"/><circle cx="12" cy="-8" r="3"/><circle cx="-6" cy="8" r="3"/></g>' },
  { key: 'douche', label: 'Douche', scene: 'douche', turn: 0, hint: 'Sleep de douche over het schuim om het weg te spoelen.',
    glyph: () => '<rect x="-5" y="-44" width="10" height="30" rx="5" fill="#9aa3b2"/><path d="M-24 -8 C-24 -24 24 -24 24 -8 Z" fill="#b8c2d0"/><rect x="-26" y="-10" width="52" height="8" rx="4" fill="#9aa3b2"/>'
      + '<g stroke="#5ec8ff" stroke-width="4" stroke-linecap="round"><path d="M-16 6v12M-5 8v18M6 8v18M17 6v12"/></g>' },
  { key: 'handdoek', label: 'Handdoek', scene: 'douche', hint: 'Sleep de handdoek over de druppels om je af te drogen.',
    glyph: () => '<rect x="-24" y="-22" width="48" height="44" rx="8" fill="#ff8ac8"/><g stroke="#fff" stroke-width="4"><path d="M-24 -8h48M-24 8h48"/></g>' },
  { key: 'tanden', label: 'Tandenborstel', scene: 'spiegel', turn: 0, hint: 'Sleep de tandenborstel heen en weer over je tanden.',
    glyph: () => '<rect x="-6" y="-5" width="60" height="9" rx="4.5" fill="#5ec8ff"/><rect x="-26" y="-7" width="26" height="12" rx="4" fill="#5ec8ff"/>'
      + '<g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M-21 6v8M-15 6v8M-9 6v8M-3 6v8"/></g>' },
  { key: 'lips', label: 'Lippenstift', scene: 'spiegel', hint: 'Kies een kleur lippenstift en tik op je gezicht.',
    glyph: (c) => `<rect x="-9" y="2" width="18" height="34" rx="4" fill="#3a2a4d"/><rect x="-7" y="-10" width="14" height="14" fill="#ffd43b"/><path d="M-6 -10 L-6 -24 L6 -30 L6 -10 Z" fill="${c}"/>` },
  { key: 'blush', label: 'Blush', scene: 'spiegel', hint: 'Kies een kleur blush en tik op je gezicht.',
    glyph: (c) => `${stick(38)}<path d="M-12 -4 C-15 -26 15 -26 12 -4 Z" fill="${c}"/>` },
  { key: 'eyes', label: 'Oogschaduw', scene: 'spiegel', hint: 'Kies een kleur oogschaduw en tik op je gezicht.',
    glyph: (c) => `${stick(34)}<ellipse cx="0" cy="-12" rx="7" ry="11" fill="${c}"/>` },
  { key: 'watje', label: 'Watje', scene: 'spiegel', hint: 'Tik met het watje op je gezicht om je make-up eraf te halen.',
    glyph: () => '<circle r="18" fill="#fff" stroke="#d5dde8" stroke-width="3"/><circle r="9" fill="none" stroke="#d5dde8" stroke-width="2"/>' },
];

export const toolSvg = (tool, p, color) => cursorSvg(tool.glyph(color), p, tool.turn);
