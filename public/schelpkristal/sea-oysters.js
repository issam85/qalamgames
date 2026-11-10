// Op de bodem de oesters met hun parels, en de belletjes van de prinses.
import { openness } from './sea-world.js';

// een oester: de bovenste schelp klapt open; zolang de parel er is, gloeit die
export function oysters(ctx, swim, cam) {
  swim.oysters.forEach((o) => {
    const x = o.x - cam;
    if (x < -60 || x > 1020) return;
    const open = openness(o, swim.time);
    ctx.save();
    ctx.translate(x, o.y);
    ctx.fillStyle = '#8a7fa8';
    ctx.strokeStyle = '#4a4068';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 12, 0, 0, Math.PI);
    ctx.fill();
    ctx.stroke();
    if (!o.got) {
      const glow = ctx.createRadialGradient(0, -8, 0, 0, -8, 40);
      glow.addColorStop(0, `rgba(255, 255, 255, ${0.25 + open * 0.45})`);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(-40, -48, 80, 80);
      ctx.fillStyle = '#fbf7f0';
      ctx.beginPath();
      ctx.arc(0, -6, 9, 0, 6.28);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-3, -9, 3, 0, 6.28);
      ctx.fill();
    }
    // de bovenste schelp draait om het scharnier aan de linkerkant
    ctx.translate(-30, 0);
    ctx.rotate(-open * 0.9);
    ctx.fillStyle = '#a99cc8';
    ctx.beginPath();
    ctx.ellipse(30, 0, 30, 12, 0, Math.PI, 0);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

export function bubbles(ctx, swim, cam) {
  ctx.strokeStyle = 'rgba(220, 240, 255, 0.8)';
  ctx.lineWidth = 1.5;
  swim.bubbles.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x - cam, b.y, b.r, 0, 6.28);
    ctx.stroke();
  });
}
