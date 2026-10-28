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
