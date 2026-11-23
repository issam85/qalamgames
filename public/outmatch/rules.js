// De wedstrijd zonder beeld: klaarstaan, spelen, blessuretijd, penalty's en het einde.
import { STEP, KEEPER, CPU, MATCH } from './config.js';
import { createBall, placeBall, stepBall, goalSide } from './ball.js';
import { stepPlayer } from './player.js';
import { createKeeper, placeKeeper, stepKeeper } from './keeper.js';
import { createTeams, kickOffSpots, separate } from './teams.js';
import { cpuIntent } from './cpu.js';
import { startClock, stepClock } from './clock.js';
import { createShootout, recordKick } from './shootout.js';
import { setupKick, stepKick } from './penalty.js';

// humans: de echte spelers (in team 0); [] = CPU tegen CPU
export function createMatch({ level = 'normal', humans = ['p1'] } = {}) {
  const match = {
    ball: createBall(),
    players: createTeams(humans),
    keepers: [createKeeper({ id: 'k0', team: 0, side: -1 }), createKeeper({ id: 'k1', team: 1, side: 1 })],
    level: KEEPER.levels[level],
    cpu: CPU.levels[level],
    events: [],
    spare: 0,
  };
  resetMatch(match);
  match.phase = 'ready'; // wacht op de startknop
  return match;
}

// een nieuwe wedstrijd met dezelfde spelers
export function resetMatch(match) {
  Object.assign(match, { score: [0, 0], goals: [], shootout: null, kick: null, phase: 'play' });
  match.players.forEach((p) => { p.jesusUsed = false; });
  startClock(match);
  kickOff(match, 0);
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
  Object.assign(match, { kickTeam: team, kickWait: MATCH.kickWait, pause: 0, scorer: null });
}

function checkGoal(match) {
  const side = goalSide(match.ball);
  if (!side) return;
  const team = side > 0 ? 0 : 1; // in het doel op +x scoort team 0
  const by = match.ball.lastTouch;
  const own = Boolean(by && by.team !== team);
  match.score[team]++;
  match.goals.push({ team, name: by ? by.name || 'Keeper' : '', own, at: match.elapsed });
  Object.assign(match, { scorer: team, pause: MATCH.goalPause });
  match.events.push({ type: 'goal', team, side, by, own });
}

function intentOf(player, match, intents) {
  if (!player.cpu) {
    const intent = intents[player.id] || {};
    if (intent.call) player.callTime = CPU.call;
    return intent;
  }
  return match.pause > 0 ? {} : cpuIntent(player, match, STEP);
}

function endOrShootout(match) {
  if (match.score[0] !== match.score[1]) {
    match.phase = 'end';
    match.events.push({ type: 'fulltime' });
    return;
  }
  match.phase = 'penalties';
  match.shootout = createShootout(Math.random() < 0.5 ? 0 : 1);
  match.kick = setupKick(match, match.shootout.turn, 0);
  match.events.push({ type: 'shootout' });
}

function playTick(match, intents) {
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
    return;
  }
  checkGoal(match);
  if (stepClock(match, STEP) === 'fulltime') endOrShootout(match);
}

// één stap van de penalty's; de echte schutter drukt op schieten of passen
function penaltyTick(match, intents) {
  const { kick, shootout } = match;
  const intent = intents[kick.shooter.id] || {};
  const press = Boolean(intent.shoot || intent.pass);
  const pressed = press && !match.penaltyHeld;
  match.penaltyHeld = press;
  if (!stepKick(match, kick, pressed)) return;
  const winner = recordKick(shootout, kick.team, kick.result === 'goal');
  if (winner !== null) {
    match.phase = 'end';
    match.events.push({ type: 'fulltime', shootout: true });
    return;
  }
  const round = shootout.kicks[shootout.turn].length;
  match.kick = setupKick(match, shootout.turn, round);
}

function tick(match, intents) {
  if (match.phase === 'play' || match.phase === 'injury') playTick(match, intents);
  else if (match.phase === 'penalties') penaltyTick(match, intents);
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

// wie er gewonnen heeft (0, 1) of null bij gelijkspel
export function winnerOf(match) {
  if (match.shootout) return match.shootout.winner;
  if (match.score[0] === match.score[1]) return null;
  return match.score[0] > match.score[1] ? 0 : 1;
}
