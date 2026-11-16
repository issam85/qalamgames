// Het musje: bruin met een lichte buik, kantelt mee met de snelheid en klapt bij elke fladder.

function wingAngle(world) {
  const b = world.bird;
  if (world.state === 'ready') return Math.sin(world.time * 14) * 0.7;
  if (world.state !== 'play') return 0.3;
  const since = world.time - b.flapAt;
  return since < 0.3 ? Math.sin((since / 0.3) * Math.PI * 2) * 0.9 : 0.25;
}

export function drawBird(ctx, world) {
  const b = world.bird;
  const alive = world.state === 'ready' || world.state === 'play';
  const tilt = world.state === 'ready' ? 0 : Math.max(-0.5, Math.min(1.3, b.vy / 520));
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(tilt);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4e2f1a';
  // staartje
  ctx.fillStyle = '#7b5236';
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(-27, -9);
  ctx.lineTo(-26, 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // lijf
  const g = ctx.createRadialGradient(-4, -8, 3, 0, 0, 20);
  g.addColorStop(0, '#c99a6d');
  g.addColorStop(1, '#8f603d');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // buik
  ctx.fillStyle = '#f6e7cf';
  ctx.beginPath();
  ctx.ellipse(3, 7, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // kopje
  ctx.fillStyle = '#6b4329';
  ctx.beginPath();
  ctx.ellipse(6, -10, 11, 6, 0.1, Math.PI, 0);
  ctx.fill();
  // snavel
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.moveTo(16, -3);
  ctx.lineTo(27, 0);
  ctx.lineTo(16, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  drawEye(ctx, alive);
  drawWing(ctx, wingAngle(world));
  ctx.restore();
}

function drawEye(ctx, alive) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(9, -4, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (alive) {
    ctx.fillStyle = '#1b1b1b';
    ctx.beginPath();
    ctx.arc(11, -4, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(12, -5.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.strokeStyle = '#1b1b1b';
  ctx.beginPath();
  ctx.moveTo(6, -7);
  ctx.lineTo(12, -1);
  ctx.moveTo(12, -7);
  ctx.lineTo(6, -1);
  ctx.stroke();
}

function drawWing(ctx, angle) {
  ctx.save();
  ctx.translate(-3, 0);
  ctx.rotate(-angle);
  ctx.fillStyle = '#7b5236';
  ctx.strokeStyle = '#4e2f1a';
  ctx.beginPath();
  ctx.ellipse(-4, 0, 13, 7, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#4e2f1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-12, 1);
  ctx.lineTo(2, -1);
  ctx.moveTo(-10, 4);
  ctx.lineTo(1, 3);
  ctx.stroke();
  ctx.restore();
}
