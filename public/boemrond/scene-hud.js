// Tekst en aanwijzingen boven het speelveld.
import { drawKid } from './kid.js';

const FONT = 'Fredoka, Nunito, sans-serif';

export function label(c, text, x, y, size, fill, stroke) {
  c.font = `700 ${size}px ${FONT}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = size * 0.22;
    c.lineJoin = 'round';
    c.strokeText(text, x, y);
  }
  c.fillStyle = fill;
  c.fillText(text, x, y);
}

function pill(c, text, x, y, size, bg, fg) {
  c.font = `700 ${size}px ${FONT}`;
  const w = c.measureText(text).width + size * 1.2;
  c.fillStyle = bg;
  c.beginPath();
  c.roundRect(x - w / 2, y - size * 0.8, w, size * 1.6, size * 0.8);
  c.fill();
  label(c, text, x, y + 1, size, fg);
}

export function drawName(c, player, x, y) {
  const human = player.human >= 0;
  pill(c, player.name, x, y + 18, human ? 17 : 14, human ? '#ffd43b' : 'rgba(255,255,255,.82)', human ? '#7a4b00' : '#40506b');
}

// De toets die je nu moet indrukken, boven het hoofd.
export function drawKeyPrompt(c, glyph, x, y, t) {
  const r = 27 + Math.sin(t * 12) * 3;
  c.fillStyle = '#c9a400';
  c.beginPath();
  c.arc(x, y + 4, r, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#ffd43b';
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
  label(c, glyph, x, y + 1, glyph.length > 1 ? 21 : 33, '#7a2e00');
}

export function drawWait(c, x, y) {
  pill(c, 'Wacht…', x, y, 19, '#fff', '#c62828');
}

// "Tik… tak…" groot op de grond, midden in de kring.
export function drawTikTak(c, v, text, urgent) {
  label(c, text, v.cx, v.cy - 8, urgent ? 58 : 46, urgent ? '#d32f2f' : '#b39b70');
}

export function drawTopBar(c, v, g) {
  if (g.round > 0) pill(c, `Ronde ${g.round}`, v.w - 124, 34, 20, 'rgba(255,255,255,.92)', '#1565c0');
  const justHit = g.phase === 'boom' || g.phase === 'over' ? g.players[g.loser] : null;
  g.players.filter((p) => p.out && p !== justHit).forEach((p, i) => {
    drawKid(c, p.kid, 38 + i * 56, 72, 0.5, { mood: 'soot' });
  });
}

function banner(c, v, big, small, color) {
  c.fillStyle = 'rgba(10,20,50,.5)';
  c.fillRect(0, v.h / 2 - 76, v.w, 152);
  label(c, big, v.w / 2, v.h / 2 - 16, 76, color, '#7a1c10');
  if (small) label(c, small, v.w / 2, v.h / 2 + 46, 28, '#fff');
}

export function drawBanners(c, v, g, touch) {
  if (g.phase === 'intro') {
    banner(c, v, `Ronde ${g.round}`, touch ? 'Tik zodra de bom bij je is!' : 'Klaar om door te geven?', '#ffd43b');
  } else if (g.phase === 'boom') {
    const p = g.players[g.loser];
    banner(c, v, 'BOEM!', p.name === 'Jij' ? 'Jij hield de bom vast!' : `${p.name} hield de bom vast!`, '#ff7043');
  }
}
