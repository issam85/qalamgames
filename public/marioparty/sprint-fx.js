// Extra beeldeffecten van de sprint op het overlay-canvas: snelheidslijnen achter een
// loper in turbo en een korte witte flits als de eerste loper finisht.

// witte strepen links achter de loper, die met de snelheid meetrillen
export function speedLines(ctx, x, y, height, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const yy = y - height * (0.15 + i * 0.17);
    const len = height * (0.6 + ((i * 37 + Math.floor(t * 20)) % 5) * 0.12);
    ctx.lineWidth = Math.max(1.5, height * 0.025);
    ctx.globalAlpha = 0.35 + (i % 2) * 0.35;
    ctx.beginPath();
    ctx.moveTo(x - height * 0.35, yy);
    ctx.lineTo(x - height * 0.35 - len, yy);
    ctx.stroke();
  }
  ctx.restore();
}

// flash 0–1: wit over het hele beeld, snel weg
export function flash(ctx, w, h, amount) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, amount) * 0.7;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// "P1"-labeltje met een puntje naar beneden boven de eigen loper
export function playerMarker(ctx, x, y, tag, color) {
  ctx.save();
  ctx.font = '700 18px Fredoka, sans-serif';
  const w = ctx.measureText(tag).width + 18;
  ctx.fillStyle = color === '#ffffff' ? '#e53935' : color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - 30, w, 26, 10);
  ctx.moveTo(x - 7, y - 5);
  ctx.lineTo(x, y + 4);
  ctx.lineTo(x + 7, y - 5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(tag, x, y - 11);
  ctx.restore();
}

// pijl aan de rand van het beeld als de eigen loper buiten beeld is
export function edgeArrow(ctx, side, y, width, tag, color) {
  const x = side === 'left' ? 34 : width - 34;
  const dir = side === 'left' ? -1 : 1;
  ctx.save();
  ctx.fillStyle = color === '#ffffff' ? '#e53935' : color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + dir * 22, y);
  ctx.lineTo(x - dir * 4, y - 20);
  ctx.lineTo(x - dir * 4, y + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.font = '700 16px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(tag, x - dir * 14, y + 38);
  ctx.restore();
}
