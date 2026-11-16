// Eén penalty: richten (een pijl die heen en weer gaat), kracht (een balk), schieten en kijken
// of hij erin gaat. De keeper gokt een hoek; hoe vaak goed hangt af van de moeilijkheid.
import { FIELD, GOAL, MATCH, STEP } from './config.js';
import { placeBall, stepBall, goalSide } from './ball.js';
import { placePlayer } from './player.js';
import { placeKeeper, stepKeeper } from './keeper.js';
import { startDive } from './save.js';

const EDGE = GOAL.halfW - 0.25; // de pijl gaat tot net binnen de palen

function taker(match, team, round) {
  const humans = match.players.filter((p) => p.team === team && !p.cpu);
  const pool = humans.length ? humans : match.players.filter((p) => p.team === team);
  return pool[round % pool.length];
}

// zet de schutter, de bal en de keeper klaar; de rest kijkt vanaf de middenlijn
export function setupKick(match, team, round) {
  const shooter = taker(match, team, round);
  const a = shooter.attack;
  const spotX = a * (FIELD.halfL - MATCH.spot);
  placeBall(match.ball, spotX, 0);
  match.players.forEach((p, i) => {
    if (p === shooter) placePlayer(p, spotX - a * 1, 0);
    else placePlayer(p, -a * 1.5, (i - 2.5) * 1.6);
  });
  match.keepers.forEach(placeKeeper);
  const keeper = match.keepers.find((k) => k.team !== team);
  keeper.pos.x = keeper.side * (FIELD.halfL - 0.4);
  return { team, shooter, keeper, stage: 'aim', t: 0, aimZ: 0, power: 0, wait: 0, result: null,
    cpuZ: (Math.random() < 0.5 ? -1 : 1) * (0.9 + Math.random() * 1.2), cpuPower: 0.45 + Math.random() * 0.4 };
}

// de keeper kiest een kant op het moment van schieten: met kans 'guess' de goede
function keeperGuess(kick, level) {
  const real = Math.sign(kick.aimZ) * (Math.abs(kick.aimZ) > 0.6 ? 1 : 0);
  const sides = [-1, 0, 1];
  const pick = Math.random() < level.guess ? real : sides.filter((s) => s !== real)[Math.floor(Math.random() * 2)];
  if (pick) startDive(kick.keeper, pick * 1.5);
  kick.keeper.diveHigh = 0.2;
  kick.keeper.speed = level.dive;
}

function shoot(match, kick) {
  const { ball } = match;
  const a = kick.shooter.attack;
  const goalX = a * FIELD.halfL;
  const dx = goalX - ball.pos.x, dz = kick.aimZ - ball.pos.z;
  const len = Math.hypot(dx, dz);
  const speed = 13 + kick.power * 15;
  Object.assign(ball.vel, { x: (dx / len) * speed, z: (dz / len) * speed, y: 1 + kick.power ** 3 * 12 });
  ball.pos.y += 0.01;
  ball.lastTouch = kick.shooter;
  kick.shooter.kickTime = 0.25;
  kick.shooter.facing = Math.atan2(-dz, dx);
  keeperGuess(kick, match.level);
  kick.stage = 'fly';
  kick.t = 0;
  match.events.push({ type: 'kick', power: kick.power, player: kick.shooter });
}

// pressed: de speler drukte net op schieten (alleen bij een echte schutter)
export function stepKick(match, kick, pressed) {
  kick.t += STEP;
  const human = !kick.shooter.cpu;
  if (kick.stage === 'aim') {
    kick.aimZ = Math.sin((kick.t / MATCH.aimPeriod) * Math.PI * 2) * EDGE;
    if (human ? pressed : kick.t > 1.1) {
      if (!human) kick.aimZ = Math.max(-EDGE, Math.min(EDGE, kick.cpuZ));
      kick.stage = 'power';
      kick.t = 0;
    }
  } else if (kick.stage === 'power') {
    const phase = (kick.t / MATCH.powerPeriod) % 1;
    kick.power = phase < 0.5 ? phase * 2 : 2 - phase * 2;
    if (human ? pressed : kick.t > 0.6) {
      if (!human) kick.power = kick.cpuPower;
      shoot(match, kick);
    }
  } else if (kick.stage === 'fly') {
    const events = [];
    stepKeeper(kick.keeper, match.ball, [], match.level, STEP, events);
    stepBall(match.ball, STEP, events);
    const speed = Math.hypot(match.ball.vel.x, match.ball.vel.z);
    if (goalSide(match.ball)) kick.result = 'goal';
    else if (events.some((e) => e.type === 'save')) kick.result = 'save';
    else if (kick.t > 2.2 || (kick.t > 0.4 && speed < 0.5)) kick.result = 'mis';
    if (kick.result) {
      kick.stage = 'done';
      kick.t = 0;
      match.events.push({ type: 'penalty', result: kick.result, team: kick.team, player: kick.shooter });
    }
  } else if (kick.stage === 'done') {
    stepBall(match.ball, STEP, []);
    stepKeeper(kick.keeper, match.ball, [], match.level, STEP, []);
  }
  return kick.stage === 'done' && kick.t >= MATCH.resultPause;
}
