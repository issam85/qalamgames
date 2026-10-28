// Publiek langs de baan: Toads in twee rijen achter de randstenen. Ze wachten tijdens
// het aftellen, juichen en klappen tijdens de race en springen bij de finish.
import { createSprite, play, update } from './sprites.js';
import { createRunner3d, updateRunner3d } from './sprint-runner3d.js';
import { TRACK_LEN } from './sprint-track.js';
import { STAND_TOPS } from './sprint-decor.js';

const CROWD_H = 1.5;
// lichte tinten zodat niet elke Toad er hetzelfde uitziet
const TINTS = ['#ffffff', '#fff1f6', '#eef6ff', '#fffbe8', '#f1fff0'];

export function buildCrowd(scene, trackWidth) {
  const fans = [];
  const back = -trackWidth / 2 - 2.2;
  for (let x = -8; x < TRACK_LEN + 14; x += 2.3) {
    [0, 1].forEach((rowNr) => {
      if (Math.random() < 0.15) return;
      const sprite = createSprite('toad', 'idle');
      sprite.t = Math.random() * 3;
      const fan = createRunner3d(scene, sprite, CROWD_H * (0.9 + Math.random() * 0.2));
      fan.mesh.material.color.set(TINTS[Math.floor(Math.random() * TINTS.length)]);
      fan.x = x + (Math.random() - 0.5) * 1.2 + rowNr * 1.1;
      fan.z = back - rowNr * 1.6 - Math.random() * 0.4;
      fan.lift = STAND_TOPS[rowNr];
      fan.favourite = Math.random() < 0.5 ? 'cheer' : 'clap';
      fan.speed = 0.8 + Math.random() * 0.5;
      fans.push(fan);
    });
  }
  return { fans, mood: '' };
}

// mood: 'wait' (aftellen), 'race' of 'finish'
export function updateCrowd(crowd, dt, mood, camera) {
  if (crowd.mood !== mood) {
    crowd.mood = mood;
    crowd.fans.forEach((fan) => {
      const anim = mood === 'wait' ? 'idle' : mood === 'finish' && Math.random() < 0.6 ? 'jump' : fan.favourite;
      play(fan.sprite, anim, true);
      fan.sprite.t = Math.random() * 0.8;
    });
  }
  crowd.fans.forEach((fan) => {
    fan.sprite.speed = fan.speed;
    update(fan.sprite, dt);
    // na een sprong weer gewoon juichen
    if (fan.sprite.anim === 'jump' && fan.sprite.t > 2.6) play(fan.sprite, 'cheer');
    updateRunner3d(fan, fan.x, fan.z, camera, fan.lift);
  });
}
