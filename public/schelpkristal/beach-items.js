// Een schelp (drie soorten) en een groepje kristallen, getekend rond (0, 0) op het
// canvas; it = { type, color }. En een sterretje voor het glinsteren.
export function shell(ctx, it) {
  ctx.fillStyle = it.color;
  ctx.strokeStyle = 'rgba(90, 50, 40, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (it.type === 0) {
    ctx.moveTo(0, 6);
    ctx.lineTo(-15, -6);
    ctx.quadraticCurveTo(0, -24, 15, -6);
  } else if (it.type === 1) {
    ctx.ellipse(0, -6, 9, 13, 0.9, 0, 6.28);
    ctx.moveTo(6, 2);
    ctx.lineTo(18, 6);
    ctx.lineTo(8, -2);
  } else {
    ctx.ellipse(0, -4, 14, 10, 0, Math.PI, 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  for (let k = -2; k <= 2; k += 1) {
    ctx.moveTo(0, 4);
    ctx.lineTo(k * 5, -12 + Math.abs(k) * 3);
  }
  ctx.stroke();
}

export function crystal(ctx, it) {
  [[-8, 0, 7, 20, -0.3], [8, 0, 6, 16, 0.35], [0, 2, 8, 26, 0]].forEach(([x, y, w, h, a]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = it.color;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-w, 0);
    ctx.lineTo(-w, -h + w);
    ctx.lineTo(0, -h);
    ctx.lineTo(w, -h + w);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(-w + 2, -h + w, w * 0.6, h - w - 2);
    ctx.restore();
  });
}

// een sterretje van vier punten
export function sparkle(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
  ctx.fill();
}
