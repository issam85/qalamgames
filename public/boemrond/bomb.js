// De bom: zwart met een lont en een ring rode lampjes die knipperen.
export function drawBomb(c, x, y, r, lit, t) {
  c.save();
  c.translate(x, y);
  if (lit) {
    const glow = c.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 2.6);
    glow.addColorStop(0, 'rgba(255,40,30,.55)');
    glow.addColorStop(1, 'rgba(255,40,30,0)');
    c.fillStyle = glow;
    c.beginPath();
    c.arc(0, 0, r * 2.6, 0, Math.PI * 2);
    c.fill();
  }
  c.strokeStyle = '#8d6e63';
  c.lineWidth = r * 0.16;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(r * 0.45, -r * 0.85);
  c.quadraticCurveTo(r * 0.9, -r * 1.5, r * 1.3, -r * 1.15);
  c.stroke();
  const flicker = 0.7 + Math.sin(t * 40) * 0.3;
  c.fillStyle = '#ffb300';
  c.beginPath();
  c.arc(r * 1.3, -r * 1.15, r * 0.3 * flicker, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#fff59d';
  c.beginPath();
  c.arc(r * 1.3, -r * 1.15, r * 0.14 * flicker, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#23252b';
  c.beginPath();
  c.arc(0, 0, r, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255,255,255,.28)';
  c.beginPath();
  c.ellipse(-r * 0.36, -r * 0.42, r * 0.28, r * 0.17, -0.7, 0, Math.PI * 2);
  c.fill();
  for (let i = 0; i < 5; i++) {
    const a = 0.25 + (i / 4) * (Math.PI - 0.5);
    const lx = Math.cos(a) * r * 0.68;
    const ly = Math.sin(a) * r * 0.42 + r * 0.14;
    c.fillStyle = lit ? '#ff3b30' : '#5c1712';
    c.beginPath();
    c.arc(lx, ly, r * 0.13, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}
