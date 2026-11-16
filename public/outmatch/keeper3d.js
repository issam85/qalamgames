// De keeper in beeld: klaarstaan met de armen wijd, duiken, liggen, de bal vasthouden en uitgooien.
import { KEEPER } from './config.js';

export function poseKeeper(fig, keeper, dt) {
  const { body, legs, arms } = fig;
  fig.root.position.set(keeper.pos.x, 0, keeper.pos.z);
  fig.root.rotation.y = keeper.facing;
  const speed = Math.hypot(keeper.vel.x, keeper.vel.z);
  fig.phase += dt * speed * 2.2;
  body.position.y = 0;
  body.rotation.set(0, 0, 0);
  const shuffle = Math.sin(fig.phase) * Math.min(1, speed / 3) * 0.35;
  legs[0].rotation.set(shuffle, 0, 0);
  legs[1].rotation.set(-shuffle, 0, 0);
  arms[0].rotation.set(0.7, 0, 0.2); // armen wijd, handen open
  arms[1].rotation.set(-0.7, 0, 0.2);
  // duikrichting in de eigen assen van de figuur (+z van de figuur is rechts)
  const local = keeper.diveDir * Math.cos(keeper.facing);
  if (keeper.state === 'dive') {
    const t = Math.min(1, (KEEPER.diveTime + KEEPER.windup - keeper.timer) / 0.25);
    body.rotation.x = local * 1.35 * t;
    body.position.y = (0.25 + keeper.diveHigh * 0.8) * Math.sin(t * Math.PI * 0.6);
    arms[0].rotation.x = arms[1].rotation.x = local * 2.8 * t;
  } else if (keeper.state === 'down') {
    body.rotation.x = local * 1.5;
    body.position.y = 0.1;
    arms[0].rotation.x = arms[1].rotation.x = local * 2.8;
  } else if (keeper.state === 'hold') { // bal tegen de borst
    arms[0].rotation.set(-0.25, 0, 1.2);
    arms[1].rotation.set(0.25, 0, 1.2);
  }
  if (keeper.kickTime > 0) { // uitgooien: arm van achter naar voren
    arms[1].rotation.set(0, 0, -1.5 + (1 - keeper.kickTime / 0.25) * 3.5);
  }
}
