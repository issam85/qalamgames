// Alles wat je ziet in 3D: wereld, lantaarn, effecten en de checkpoints van de oefenmodus.
import * as THREE from '../marioparty/vendor/three.module.min.js';
import { createWorld } from './world.js';
import { buildObstacles } from './obstacles3d.js';
import { createBoosts } from './boosts3d.js';
import { createPortals } from './portals3d.js';
import { createHazards } from './hazards3d.js';
import { createPlayer } from './player3d.js';
import { createShatter } from './shatter.js';
import { createFx } from './fx.js';
import { playEvents } from './events.js';

function addMarkers(stage, points, color) {
  const mesh = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.3),
    new THREE.MeshBasicMaterial({ color }),
    points.length,
  );
  const matrix = new THREE.Matrix4();
  points.forEach((x, i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, 3.2, 0)));
  mesh.frustumCulled = false;
  mesh.visible = false;
  stage.add(mesh);
  return mesh;
}

export function createView(canvas) {
  const world = createWorld(canvas);
  const player = createPlayer(world.scene);
  const shatter = createShatter(world.scene);
  const fx = createFx(world.scene);
  let boosts = null;
  let portals = null;
  let hazards = null;
  let markers = null;
  let finish = 0;

  return {
    load(level) {
      const stage = world.load(level);
      buildObstacles(stage, level);
      boosts = createBoosts(stage, level);
      portals = createPortals(stage, level);
      hazards = createHazards(stage, level);
      markers = {
        practice: addMarkers(stage, level.checkpoints, '#7dff9b'),
        lives: addMarkers(stage, level.lifeCheckpoints, '#ffd43b'),
      };
      finish = level.length;
    },
    setSkin(skin) {
      player.setSkin(skin);
      shatter.setColor(skin.body);
      fx.setSpark(skin.body);
    },
    reset(practice) {
      player.reset();
      player.setVisible(true);
      shatter.hide();
      markers.practice.visible = practice;
      markers.lives.visible = !practice;
    },
    crash(run) {
      player.setVisible(false);
      shatter.burst(run.x, run.y);
      world.kick(0.55);
    },
    checkpoint: (run) => fx.burst(run.x, run.y + 0.45, '#7dff9b', 14, 6),
    events: (run) => playEvents(run, fx, world),
    trail: (run, dt) => fx.trail(run, dt),
    finale: (dt) => fx.finale(finish, dt),
    draw(run, dt, inMenu) {
      player.update(run, dt, inMenu);
      boosts.update(run, dt);
      portals.update(dt);
      hazards.update(run, dt);
      shatter.update(dt);
      fx.update(dt);
      world.follow(run, dt, inMenu);
      world.render();
    },
  };
}
