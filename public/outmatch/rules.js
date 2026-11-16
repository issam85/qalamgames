// De wedstrijd zonder beeld: bal, spelers, stand en wat er gebeurt na een doelpunt.
import { STEP } from './config.js';
import { createBall, placeBall, stepBall, goalSide } from './ball.js';
import { createPlayer, placePlayer, stepPlayer } from './player.js';

const GOAL_PAUSE = 1.6; // juichen voordat de bal terug naar het midden gaat

export function createMatch() {
  return {
    ball: createBall(),
    players: [createPlayer({ id: 'p1', team: 0, attack: 1, x: -3, z: 0 })],
    score: [0, 0],
    pause: 0,
    scorer: null, // team dat net scoorde
    events: [],
    spare: 0,
  };
}

// iedereen terug naar de aftrap
export function kickOff(match) {
  placeBall(match.ball);
  match.players.forEach((p, i) => placePlayer(p, -p.attack * (3 + i * 2), 0));
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

function tick(match, intents) {
  match.players.forEach((p) => stepPlayer(p, intents[p.id] || {}, match.ball, STEP, match.events));
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
