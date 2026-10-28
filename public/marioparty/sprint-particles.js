// Deeltjes van de sprint in wereldcoördinaten (stofwolken, confetti). Ze worden elk
// frame opnieuw naar het scherm geprojecteerd, zodat ze bij een camerabeweging op hun
// plek in de wereld blijven. De race zelf hoeft niets van het beeld te weten.
const CONFETTI_COLORS = ['#e53935', '#ffd43b', '#43a047', '#1e88e5', '#ff8ac8', '#ff9f1c'];

// witte bolle wolkjes achter een loper (size 1 = normaal, groter bij turbo)
export function spawnCloud(list, x, z, size = 1) {
  for (let i = 0; i < 3; i++) {
    list.push({
      kind: 'cloud', x: x - i * 0.25 * size, y: 0.15 + Math.random() * 0.25, z: z + (Math.random() - 0.5) * 0.4,
      vx: -1.6 - Math.random() * 1.4, vy: 0.4 + Math.random() * 0.6, vz: 0,
      r: (0.11 + Math.random() * 0.09) * size, grow: 0.32 * size, life: 0.42, age: 0,
    });
  }
}

export function spawnConfetti(list, x, y, z, n = 40) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 4;
    list.push({
      kind: 'confetti', x, y, z, vx: Math.cos(a) * speed * 0.6, vy: 4 + Math.random() * 5, vz: Math.sin(a) * speed * 0.6,
      r: 0.09, rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 14,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length], life: 1.8 + Math.random() * 0.6, age: 0,
    });
  }
}

export function updateParticles3d(list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.age += dt;
    if (p.age >= p.life) {
      list.splice(i, 1);
      continue;
    }
    if (p.kind === 'confetti') {
      p.vy -= 9 * dt;
      p.rot += p.spin * dt;
    } else {
      p.r += p.grow * dt;
      p.vx *= 0.94;
    }
    p.x += p.vx * dt;
    p.y = Math.max(0.02, p.y + p.vy * dt);
    p.z += p.vz * dt;
  }
}

// project(x, y, z) → { x, y, behind } in overlay-pixels; de straal volgt de afstand
export function drawParticles3d(ctx, list, project) {
  list.forEach((p) => {
    const c = project(p.x, p.y, p.z);
    if (c.behind) return;
    const r = Math.max(1, c.y - project(p.x, p.y + p.r, p.z).y);
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
    if (p.kind === 'confetti') {
      ctx.translate(c.x, c.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-r, -r / 2, r * 2, r);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = 'rgba(160, 175, 200, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  });
}
