// De wedstrijd zonder beeld: bal, 3 tegen 3 met keepers, stand en wat er gebeurt na een doelpunt.
import { STEP, KEEPER, CPU } from './config.js';
import { createBall, placeBall, stepBall, goalSide } from './ball.js';
import { stepPlayer } from './player.js';
import { createKeeper, placeKeeper, stepKeeper } from './keeper.js';
import { createTeams, kickOffSpots, separate } from './teams.js';
import { cpuIntent } from './cpu.js';

const GOAL_PAUSE = 1.6; // juichen voordat de bal terug naar het midden gaat
const KICK_WAIT = 1.2; // het andere team wacht even bij de aftrap

// humans: de echte spelers (in team 0); [] = CPU tegen CPU
export function createMatch({ level = 'normal', humans = ['p1'] } = {}) {
  return {
    ball: createBall(),
    players: createTeams(humans),
    keepers: [createKeeper({ id: 'k0', team: 0, side: -1 }), createKeeper({ id: 'k1', team: 1, side: 1 })],
    level: KEEPER.levels[level],
    cpu: CPU.levels[level],
    score: [0, 0],
    pause: 0,
    scorer: null, // team dat net scoorde
    kickTeam: 0,
    kickWait: 0,
    events: [],
    spare: 0,
  };
}

// iedereen op het veld: spelers en keepers
export function everyone(match) {
  return [...match.players, ...match.keepers];
}

// iedereen terug naar de aftrap; het team dat een doelpunt tegen kreeg, begint
export function kickOff(match, team = match.kickTeam) {
  placeBall(match.ball);
  kickOffSpots(match.players, team);
  match.players.forEach((p) => { p.brain = null; });
  match.keepers.forEach(placeKeeper);
  match.kickTeam = team;
  match.kickWait = KICK_WAIT;
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
  match.events.push({ type: 'goal', team, side, by: match.ball.lastTouch });
}

function intentOf(player, match, intents) {
  if (!player.cpu) {
    const intent = intents[player.id] || {};
    if (intent.call) player.callTime = CPU.call;
    return intent;
  }
  return match.pause > 0 ? {} : cpuIntent(player, match, STEP);
}

function tick(match, intents) {
  const all = everyone(match);
  const { ball } = match;
  if (match.kickWait > 0 && (ball.owner || Math.hypot(ball.pos.x, ball.pos.z) > 1)) match.kickWait = 0;
  match.kickWait = Math.max(0, match.kickWait - STEP);
  match.players.forEach((p) => {
    p.callTime = Math.max(0, (p.callTime || 0) - STEP);
    stepPlayer(p, intentOf(p, match, intents), ball, all, STEP, match.events);
  });
  if (match.pause <= 0) { // tijdens het juichen staan de keepers stil
    match.keepers.forEach((k) => stepKeeper(k, ball, all, match.level, STEP, match.events));
  }
  separate(match.players, match.keepers);
  stepBall(ball, STEP, match.events);
  if (match.pause > 0) {
    ball.noTouch = 1; // tijdens het juichen blijft de bal liggen
    match.pause -= STEP;
    if (match.pause <= 0) kickOff(match, 1 - match.scorer);
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
