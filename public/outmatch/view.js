// Alles in beeld samen: de kooi, de stad, de spelers en de bal.
import { FIELD } from './config.js';
import { createWorld } from './world.js';
import { createArena } from './arena.js';
import { createCity } from './city.js';
import { createFigure, poseFigure } from './figure3d.js';
import { createBall3d, poseBall } from './ball3d.js';
import { poseKeeper } from './keeper3d.js';
import { createPenaltyMarks } from './penalty3d.js';

// ring en label voor de plekken die een echte speler kan hebben (zie SLOT in teams.js)
const TAGS = { rechts: { text: 'P1', color: '#ffd43b' }, links: { text: 'P2', color: '#4dabf7' } };
const KITS = [
  { shirt: '#e03131', pants: '#1d2b53', shoes: '#ffffff' },
  { shirt: '#f8f9fa', pants: '#343a40', shoes: '#1d2b53' },
];
const KEEPER_KITS = [
  { shirt: '#2f9e44', pants: '#1b4332', shoes: '#ffffff', gloves: '#ffd43b' },
  { shirt: '#f76707', pants: '#5c2b0b', shoes: '#ffffff', gloves: '#4dabf7' },
];

export function createView(canvas, match) {
  const world = createWorld(canvas);
  createArena(world.scene);
  createCity(world.scene);
  const figures = new Map();
  match.players.forEach((p) => {
    figures.set(p, createFigure(world.scene, KITS[p.team], p.team === 0 ? TAGS[p.role] : null));
  });
  const keepers = match.keepers.map((k) => createFigure(world.scene, KEEPER_KITS[k.team]));
  const ball = createBall3d(world.scene);
  const marks = createPenaltyMarks(world.scene);

  function draw(dt) {
    match.players.forEach((p) => {
      const fig = figures.get(p);
      if (fig.tag) fig.tag.visible = !p.cpu;
      poseFigure(fig, p, dt);
    });
    match.keepers.forEach((k, i) => poseKeeper(keepers[i], k, dt));
    poseBall(ball, match.ball, dt);
    marks.update(match);
    const kick = match.phase === 'penalties' && match.kick;
    world.follow(kick ? { x: kick.shooter.attack * FIELD.halfL } : match.ball.pos, kick ? dt * 4 : dt); // bij een penalty: het doel in beeld
    world.render();
  }

  return { draw };
}
