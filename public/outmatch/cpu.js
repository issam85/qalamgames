// Het brein van een CPU-veldspeler: per denkmoment kiezen wat hij doet (bal halen, druk zetten,
// vrijlopen of dekken) en elke stap dat omzetten in toetsen.
import { BALL, CPU } from './config.js';
import { dist, toward } from './geo.js';
import { openSpot, markSpot, roleSpot } from './cpu-roles.js';
import { planWithBall, withBallIntent } from './cpu-ball.js';

// waar een rollende bal na t seconden is (zonder stuiteren)
function ballAt(ball, t) {
  const k = BALL.roll;
  const f = (1 - Math.exp(-k * t)) / k;
  return { x: ball.pos.x + ball.vel.x * f, z: ball.pos.z + ball.vel.z * f };
}

// het punt waar de speler de bal het snelst kan halen, en hoe lang dat duurt
export function intercept(player, ball, speed = 7) {
  let t = dist(player.pos, ball.pos) / speed;
  let at = ball.pos;
  for (let i = 0; i < 3; i++) {
    at = ballAt(ball, t);
    t = dist(player.pos, at) / speed;
  }
  return { at, t };
}

function closestOf(group, ball) {
  return group.reduce((best, p) => {
    const t = intercept(p, ball).t;
    return !best || t < best.t ? { p, t } : best;
  }, null);
}

function decide(player, match, brain, level) {
  const { ball } = match;
  const mates = match.players.filter((p) => p.team === player.team);
  const rivals = match.players.filter((p) => p.team !== player.team);
  const owner = ball.owner;
  brain.tackle = false;
  brain.sprint = player.stamina > 0.3 && Math.random() < level.sprint;
  if (match.kickWait > 0 && player.team !== match.kickTeam) {
    brain.target = roleSpot(player, ball, false);
    brain.sprint = false;
    return;
  }
  if (owner && owner.keeper) {
    brain.target = owner.team === player.team ? openSpot(player, ball, rivals) : roleSpot(player, ball, false);
    brain.sprint = false;
    return;
  }
  if (!owner) {
    const ours = closestOf(mates, ball), theirs = closestOf(rivals, ball);
    if (ours.p === player) brain.target = intercept(player, ball).at;
    else if (ours.t < theirs.t) brain.target = openSpot(player, ball, rivals);
    else brain.target = markSpot(player, ball, rivals);
    return;
  }
  if (owner.team === player.team) {
    brain.target = openSpot(player, ball, rivals);
    brain.sprint = brain.sprint && dist(player.pos, brain.target) > 4;
    return;
  }
  // de tegenstander heeft de bal: de dichtstbijzijnde zet druk, de rest dekt
  const presser = mates.reduce((a, b) => (dist(a.pos, ball.pos) < dist(b.pos, ball.pos) ? a : b));
  if (presser !== player) {
    brain.target = markSpot(player, ball, rivals);
    return;
  }
  const goalSide = -player.attack * 0.6;
  brain.target = { x: ball.pos.x + goalSide, z: ball.pos.z };
  const calm = !owner.cpu && ball.ownTime < level.calm; // een echte speler krijgt even rust
  brain.tackle = !calm && dist(player.pos, ball.pos) < CPU.pressRange && Math.random() < level.tackle * level.think;
}

export function cpuIntent(player, match, dt) {
  const brain = player.brain || (player.brain = { next: Math.random() * 0.2, plan: null, target: null });
  const level = match.cpu;
  const { ball } = match;
  if (ball.owner === player) {
    const rivals = [...match.players, ...match.keepers].filter((p) => p.team !== player.team);
    const mates = match.players.filter((p) => p.team === player.team);
    const keeper = match.keepers.find((k) => k.team !== player.team);
    if (!brain.plan) brain.plan = planWithBall(player, mates, rivals, keeper, level);
    const intent = withBallIntent(player, brain.plan, rivals, level, dt);
    if (intent.done) brain.plan = null;
    return intent;
  }
  brain.plan = null;
  brain.next -= dt;
  if (brain.next <= 0 || !brain.target) {
    brain.next = level.think * (0.8 + Math.random() * 0.4);
    decide(player, match, brain, level);
  }
  const dir = brain.tackle ? toward(player.pos, ball.pos, 0.01) : toward(player.pos, brain.target, 0.6);
  return { x: dir.x * level.speed, z: dir.z * level.speed, sprint: brain.sprint, tackle: brain.tackle };
}
