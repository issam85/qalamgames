// Effecten: "+1" bij een punt, sterretjes, veertjes bij een botsing.

export function createFx() {
  return { items: [], flash: 0, shake: 0 };
}

export function addPoint(fx, x, y) {
  fx.items.push({ kind: 'text', x, y, vy: -60, life: 0.8, age: 0 });
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    fx.items.push({ kind: 'star', x, y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, life: 0.5, age: 0 });
  }
}

export function addCrash(fx, x, y) {
  fx.flash = 1;
  fx.shake = 0.35;
  for (let i = 0; i < 9; i++) {
    fx.items.push({
      kind: 'feather', x, y, vx: (Math.random() - 0.5) * 220, vy: -Math.random() * 200,
      spin: Math.random() * 6, life: 1.4, age: 0,
    });
  }
}

export function updateFx(fx, dt) {
  fx.flash = Math.max(0, fx.flash - dt * 4);
  fx.shake = Math.max(0, fx.shake - dt);
  for (const p of fx.items) {
    p.age += dt;
    p.x += (p.vx || 0) * dt;
    p.y += p.vy * dt;
    if (p.kind === 'feather') {
      p.vy = Math.min(60, p.vy + 300 * dt);
      p.vx *= 0.98;
    }
  }
  fx.items = fx.items.filter((p) => p.age < p.life);
}

function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

export function drawFx(ctx, fx) {
  for (const p of fx.items) {
    ctx.globalAlpha = 1 - p.age / p.life;
    if (p.kind === 'text') {
      ctx.font = '700 26px Fredoka, Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#c62828';
      ctx.strokeText('+1', p.x, p.y);
      ctx.fillStyle = '#ffd43b';
      ctx.fillText('+1', p.x, p.y);
    } else if (p.kind === 'star') {
      ctx.fillStyle = '#fff3a0';
      star(ctx, p.x, p.y, 6);
    } else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin + p.age * 4);
      ctx.fillStyle = '#a77a52';
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
}
