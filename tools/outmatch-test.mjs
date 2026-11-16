// Test de natuurkunde van OutMatch zonder beeld: node tools/outmatch-test.mjs
import { STEP, FIELD, GOAL, BALL } from '../public/outmatch/config.js';
import { createMatch, kickOff, stepMatch } from '../public/outmatch/rules.js';
import { createBall, stepBall, goalSide } from '../public/outmatch/ball.js';

let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${name} ${info}`);
  if (!ok) failed++;
}

function run(ball, seconds, events = []) {
  for (let t = 0; t < seconds; t += STEP) stepBall(ball, STEP, events);
  return events;
}

function shot(pos, vel) {
  const ball = createBall();
  Object.assign(ball.pos, pos);
  Object.assign(ball.vel, vel);
  return ball;
}

// 1. een rollende bal komt tot stilstand en blijft op de vloer
const roll = shot({ x: 0, y: BALL.radius, z: 0 }, { x: 6, y: 0, z: 0 });
run(roll, 12);
check('rollende bal stopt', Math.hypot(roll.vel.x, roll.vel.z) === 0 && Math.abs(roll.pos.y - BALL.radius) < 1e-6,
  `x=${roll.pos.x.toFixed(2)}`);

// 2. tegen de zijmuur kaatst hij terug en blijft binnen de kooi
const side = shot({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 25 });
const sideEvents = run(side, 0.6);
check('zijmuur kaatst terug', side.vel.z < 0 && sideEvents.some((e) => e.type === 'wall'));

// 3. naast het doel: de eindmuur, geen doelpunt
const wide = shot({ x: 10, y: 0.5, z: 5 }, { x: 25, y: 0, z: 0 });
run(wide, 0.5);
check('naast het doel = muur', wide.vel.x < 0 && goalSide(wide) === 0);

// 4. recht op doel: doelpunt en het net houdt hem vast
const goal = shot({ x: 8, y: 0.6, z: 0.5 }, { x: 26, y: 1, z: 0 });
let scored = 0;
for (let t = 0; t < 1.5; t += STEP) {
  stepBall(goal, STEP, []);
  scored = scored || goalSide(goal);
}
check('schot in het doel telt', scored === 1);
check('net houdt de bal in het doel', goal.pos.x > FIELD.halfL && goal.pos.x <= FIELD.halfL + GOAL.depth);

// 5. over de lat: geen doelpunt
const high = shot({ x: 9, y: 2.6, z: 0 }, { x: 24, y: 1, z: 0 });
let highGoal = 0;
for (let t = 0; t < 1; t += STEP) { stepBall(high, STEP, []); highGoal = highGoal || goalSide(high); }
check('over de lat = geen doelpunt', highGoal === 0);

// 6. tegen de paal: hij springt terug
const post = shot({ x: 10, y: 0.6, z: GOAL.halfW }, { x: 25, y: 0, z: 0 });
const postEvents = run(post, 0.4);
check('paal geraakt', postEvents.some((e) => e.type === 'post') && post.vel.x < 0);

// 7. de bal ontsnapt nooit: 2000 willekeurige harde schoten
let escaped = 0;
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
for (let i = 0; i < 2000; i++) {
  const b = shot({ x: (rand() - 0.5) * 28, y: 0.3 + rand() * 3, z: (rand() - 0.5) * 16 },
    { x: (rand() - 0.5) * 60, y: rand() * 14, z: (rand() - 0.5) * 60 });
  for (let t = 0; t < 4; t += STEP) {
    stepBall(b, STEP, []);
    const p = b.pos;
    const out = Math.abs(p.z) > FIELD.halfW || p.y < 0 || p.y > FIELD.ceiling
      || Math.abs(p.x) > FIELD.halfL + GOAL.depth + 0.01;
    if (out) { escaped++; break; }
  }
}
check('bal blijft altijd in de kooi', escaped === 0, `(${escaped} van 2000 ontsnapt)`);

// 8. speler loopt naar de bal, neemt hem aan, dribbelt en schiet raak
const match = createMatch();
kickOff(match);
const me = match.players[0];
const goals = [];
for (let t = 0; t < 8 && !goals.length; t += 1 / 60) {
  const b = match.ball.pos;
  const owns = match.ball.owner === me;
  const target = owns ? { x: 9, z: 0 } : b;
  const dx = target.x - me.pos.x, dz = target.z - me.pos.z;
  const near = owns && me.pos.x > 7;
  stepMatch(match, { p1: { x: dx, z: dz, sprint: true, shoot: near && me.charge < 0.6 } }, 1 / 60);
  goals.push(...match.events.filter((e) => e.type === 'goal'));
}
check('speler scoort vanaf de aftrap', goals.length === 1 && match.score[0] === 1);
for (let t = 0; t < 1; t += 1 / 60) stepMatch(match, { p1: { x: 1, z: 0, sprint: true } }, 1 / 60);
check('na een doelpunt blijft de bal liggen', match.ball.owner === null && match.pause > 0);
check('sprinten kost uithouding', me.stamina < 1, `(${me.stamina.toFixed(2)})`);

console.log(failed ? `\n${failed} test(s) mislukt` : '\nAlles groen');
if (failed) throw new Error('tests mislukt');
