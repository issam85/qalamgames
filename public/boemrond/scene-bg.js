// Het schoolplein: lucht, heg, tegels en de kring met pijlen zoals op de schets.
export function ellipsePoint(v, a) {
  return { x: v.cx + Math.cos(a) * v.rx, y: v.cy + Math.sin(a) * v.ry };
}

export function drawGround(c, v) {
  const band = v.h * 0.15;
  const sky = c.createLinearGradient(0, 0, 0, band);
  sky.addColorStop(0, '#35a7f0');
  sky.addColorStop(1, '#8ee0ff');
  c.fillStyle = sky;
  c.fillRect(0, 0, v.w, band);
  c.fillStyle = '#6fbf5a';
  c.fillRect(0, band, v.w, v.h - band);
  c.fillStyle = '#3f8f46';
  for (let x = -20; x < v.w + 40; x += 44) {
    c.beginPath();
    c.arc(x, band, 30, Math.PI, 0);
    c.fill();
  }
  c.fillStyle = '#e8dcc4';
  c.beginPath();
  c.ellipse(v.cx, v.cy - 8, v.rx + 70, v.ry + 52, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#f3ead8';
  c.beginPath();
  c.ellipse(v.cx, v.cy - 8, v.rx * 0.42, v.ry * 0.42, 0, 0, Math.PI * 2);
  c.fill();
}

// Pijlen op de grond tussen de kinderen, met de klok mee.
export function drawArrows(c, v, angles) {
  const n = angles.length;
  if (n < 2) return;
  c.strokeStyle = 'rgba(120,90,50,.55)';
  c.fillStyle = 'rgba(120,90,50,.55)';
  c.lineWidth = 5;
  c.lineCap = 'round';
  angles.forEach((a, i) => {
    let gap = angles[(i + 1) % n] - a;
    while (gap <= 0) gap += Math.PI * 2;
    const from = a + gap * 0.3;
    const to = a + gap * 0.66;
    c.beginPath();
    for (let k = 0; k <= 12; k++) {
      const p = ellipsePoint(v, from + ((to - from) * k) / 12);
      if (k) c.lineTo(p.x, p.y);
      else c.moveTo(p.x, p.y);
    }
    c.stroke();
    const end = ellipsePoint(v, to);
    const before = ellipsePoint(v, to - 0.05);
    const dir = Math.atan2(end.y - before.y, end.x - before.x);
    c.save();
    c.translate(end.x, end.y);
    c.rotate(dir);
    c.beginPath();
    c.moveTo(13, 0);
    c.lineTo(-5, -10);
    c.lineTo(-5, 10);
    c.closePath();
    c.fill();
    c.restore();
  });
}

// Rode gloed langs de rand; wordt sterker naarmate de bom dichter bij ontploffen is.
export function drawDanger(c, v, p, lit) {
  const strength = p * p * (lit ? 0.62 : 0.34);
  if (strength < 0.01) return;
  const r = Math.max(v.w, v.h) * 0.72;
  const g = c.createRadialGradient(v.w / 2, v.h / 2, r * 0.45, v.w / 2, v.h / 2, r);
  g.addColorStop(0, 'rgba(220,20,20,0)');
  g.addColorStop(1, `rgba(220,20,20,${strength})`);
  c.fillStyle = g;
  c.fillRect(0, 0, v.w, v.h);
}
