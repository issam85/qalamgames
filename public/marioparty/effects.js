// Deeltjes-effecten op een canvas: stofwolkjes, confetti en sterretjes.
const CONFETTI_COLORS = ['#e53935', '#ffd43b', '#43a047', '#1e88e5', '#ff8ac8', '#ff9f1c'];

export function createParticles() {
  return [];
}

// klein stofwolkje achter de voeten van een loper
export function dust(list, x, y) {
  for (let i = 0; i < 2; i++) {
    list.push({
      kind: 'dust', x, y,
      vx: -40 - Math.random() * 50, vy: -15 - Math.random() * 25,
      r: 4 + Math.random() * 4, life: 0.45, age: 0,
    });
  }
}

// wolkje naar beide kanten bij een landing
export function puff(list, x, y, size = 1) {
  for (let i = 0; i < 6; i++) {
    const dir = i % 2 ? 1 : -1;
    list.push({
      kind: 'dust', x, y,
      vx: dir * (30 + Math.random() * 50) * size, vy: -8 - Math.random() * 16,
      r: (3 + Math.random() * 3) * size, life: 0.4, age: 0,
    });
  }
}

// twinkelend sterretje
export function sparkle(list, x, y) {
  list.push({ kind: 'sparkle', x, y, vx: 0, vy: -10, r: 5 + Math.random() * 5, life: 0.7, age: 0 });
}

// confettiregen vanaf een punt
export function confetti(list, x, y, n = 40) {
  for (let i = 0; i < n; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const speed = 160 + Math.random() * 220;
    list.push({
      kind: 'confetti', x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 14,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      life: 1.6 + Math.random() * 0.6, age: 0,
    });
  }
}

export function updateParticles(list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.age += dt;
    if (p.age >= p.life) {
      list.splice(i, 1);
      continue;
    }
    if (p.kind === 'confetti') {
      p.vy += 380 * dt;
      p.vx *= 0.99;
      p.rot += p.spin * dt;
    } else if (p.kind === 'dust') {
      p.r += 18 * dt;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

export function drawParticles(ctx, list) {
  list.forEach((p) => {
    const fade = 1 - p.age / p.life;
    ctx.save();
    ctx.globalAlpha = Math.max(0, fade);
    if (p.kind === 'confetti') {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-4, -2, 8, 4);
    } else if (p.kind === 'sparkle') {
      // vierpuntige ster die opbloeit en weer krimpt
      const s = p.r * Math.sin(Math.PI * (p.age / p.life));
      ctx.globalAlpha = 1;
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#fff6c2';
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(214, 190, 150, 0.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}
