// Alles in beeld samen: de kooi, de stad, de spelers en de bal.
import { createWorld } from './world.js';
import { createArena } from './arena.js';
import { createCity } from './city.js';
import { createFigure, poseFigure } from './figure3d.js';
import { createBall3d, poseBall } from './ball3d.js';

const TAGS = { p1: { text: 'P1', color: '#ffd43b' }, p2: { text: 'P2', color: '#4dabf7' } };
const KITS = [
  { shirt: '#e03131', pants: '#1d2b53', shoes: '#ffffff' },
  { shirt: '#f8f9fa', pants: '#343a40', shoes: '#1d2b53' },
];

export function createView(canvas, match) {
  const world = createWorld(canvas);
  createArena(world.scene);
  createCity(world.scene);
  const figures = new Map();
  match.players.forEach((p) => {
    figures.set(p, createFigure(world.scene, KITS[p.team], TAGS[p.id]));
  });
  const ball = createBall3d(world.scene);

  function draw(dt) {
    match.players.forEach((p) => poseFigure(figures.get(p), p, dt));
    poseBall(ball, match.ball, dt);
    world.follow(match.ball.pos, dt);
    world.render();
  }

  return { draw };
}
