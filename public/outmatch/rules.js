// De wedstrijd zonder beeld: bal, spelers, keepers, stand en wat er gebeurt na een doelpunt.
import { STEP, KEEPER, PLAYER } from './config.js';
import { createBall, placeBall, stepBall, goalSide } from './ball.js';
import { createPlayer, placePlayer, stepPlayer } from './player.js';
import { createKeeper, placeKeeper, stepKeeper } from './keeper.js';

const GOAL_PAUSE = 1.6; // juichen voordat de bal terug naar het midden gaat

export function createMatch({ level = 'normal' } = {}) {
  return {
    ball: createBall(),
    players: [createPlayer({ id: 'p1', team: 0, attack: 1, x: -3, z: 0 })],
    keepers: [createKeeper({ id: 'k0', team: 0, side: -1 }), createKeeper({ id: 'k1', team: 1, side: 1 })],
    level: KEEPER.levels[level],
    score: [0, 0],
    pause: 0,
    scorer: null, // team dat net scoorde
    events: [],
    spare: 0,
  };
}

// iedereen op het veld: spelers en keepers
export function everyone(match) {
  return [...match.players, ...match.keepers];
}

// iedereen terug naar de aftrap
export function kickOff(match) {
  placeBall(match.ball);
  match.players.forEach((p, i) => placePlayer(p, -p.attack * (3 + i * 2), 0));
  match.keepers.forEach(placeKeeper);
  match.pause = 0;
  match.scorer = null;
}

function checkGoal(match) {
  const side = goalSide(match.ball);
  if (!side) return;
  const team = side > 0 ? 0 : 1; // in het doel op +x scoort team 0
  match.score[team]++;
  match.scorer = team;
  match.pause = GOAL_PAUSE;
  match.events.push({ type: 'goal', team, side });
}

// spelers lopen niet door de keeper heen
function separate(match) {
  match.players.forEach((p) => {
    match.keepers.forEach((k) => {
      const dx = p.pos.x - k.pos.x, dz = p.pos.z - k.pos.z;
      const dist = Math.hypot(dx, dz);
      const min = PLAYER.radius + KEEPER.radius;
      if (dist >= min || dist === 0) return;
      p.pos.x += (dx / dist) * (min - dist);
      p.pos.z += (dz / dist) * (min - dist);
    });
  });
}

function tick(match, intents) {
  const all = everyone(match);
  match.players.forEach((p) => stepPlayer(p, intents[p.id] || {}, match.ball, all, STEP, match.events));
  if (match.pause <= 0) { // tijdens het juichen staan de keepers stil
    match.keepers.forEach((k) => stepKeeper(k, match.ball, all, match.level, STEP, match.events));
  }
  separate(match);
  stepBall(match.ball, STEP, match.events);
  if (match.pause > 0) {
    match.ball.noTouch = 1; // tijdens het juichen blijft de bal liggen
    match.pause -= STEP;
    if (match.pause <= 0) kickOff(match);
  } else {
    checkGoal(match);
  }
}

// draait de natuurkunde in vaste stappen; dt is de echte tijd sinds het vorige beeld
export function stepMatch(match, intents, dt) {
  match.events.length = 0;
  match.spare += Math.min(dt, 0.1);
  while (match.spare >= STEP) {
    tick(match, intents);
    match.spare -= STEP;
  }
}
