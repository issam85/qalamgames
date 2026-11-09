// Explosie, rook, trillend beeld, witte flits en korte teksten boven de kinderen.
import { label } from './scene-hud.js';

const FIRE = ['#fff59d', '#ffca28', '#ff7043', '#e53935'];

export function createFx() {
  let parts = [];
  let pops = [];
  let shake = 0;
  let flash = 0;

  function boom(x, y) {
    shake = 0.7;
    flash = 1;
    for (let i = 0; i < 70; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = 90 + Math.random() * 420;
      parts.push({
        x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 70,
        r: 8 + Math.random() * 16, life: 0.5 + Math.random() * 0.6, age: 0,
        color: FIRE[i % FIRE.length],
      });
    }
    for (let i = 0; i < 24; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 50, y, vx: (Math.random() - 0.5) * 90, vy: -50 - Math.random() * 110,
        r: 20 + Math.random() * 26, life: 1.3 + Math.random() * 0.9, age: 0, color: '#54504c',
      });
    }
  }

  function pop(text, x, y, color = '#fff') {
    pops.push({ text, x, y, color, age: 0 });
  }

  function update(dt) {
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt * 3.2);
    parts.forEach((p) => {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 1.9;
      p.vy *= 1 - dt * 1.9;
    });
    parts = parts.filter((p) => p.age < p.life);
    pops.forEach((p) => { p.age += dt; });
    pops = pops.filter((p) => p.age < 0.9);
  }

  function draw(c, v) {
    parts.forEach((p) => {
      const k = 1 - p.age / p.life;
      c.globalAlpha = Math.min(1, k * 1.5);
      c.fillStyle = p.color;
      c.beginPath();
      c.arc(p.x, p.y, p.r * (0.5 + k * 0.7), 0, Math.PI * 2);
      c.fill();
    });
    c.globalAlpha = 1;
    pops.forEach((p) => {
      c.globalAlpha = Math.min(1, (0.9 - p.age) * 3);
      label(c, p.text, p.x, p.y - p.age * 46, 32, p.color, '#7a1c10');
    });
    c.globalAlpha = 1;
    if (flash > 0) {
      c.fillStyle = `rgba(255,255,240,${flash})`;
      c.fillRect(0, 0, v.w, v.h);
    }
  }

  const offset = () => (shake > 0
    ? [(Math.random() - 0.5) * 34 * shake, (Math.random() - 0.5) * 34 * shake]
    : [0, 0]);

  return { boom, pop, update, draw, offset };
}
