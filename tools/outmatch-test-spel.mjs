// Test spelers en keeper van OutMatch zonder beeld: node tools/outmatch-test-spel.mjs
import { FIELD, STEP } from '../public/outmatch/config.js';
import { createMatch, kickOff, stepMatch } from '../public/outmatch/rules.js';
import { createPlayer } from '../public/outmatch/player.js';

// vaste toevalsgetallen, zodat de test elke keer hetzelfde uitkomt
let seed = 12345;
Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${name} ${info}`);
  if (!ok) failed++;
}

const run = (match, seconds, intents = {}, until = () => false) => {
  for (let t = 0; t < seconds; t += STEP) {
    stepMatch(match, typeof intents === 'function' ? intents() : intents, STEP);
    if (until()) return true;
  }
  return false;
};

// een speler met de bal aan de voet op (x, z), kijkend naar angle
function withBall(match, x, z, angle = 0) {
  const me = match.players[0];
  Object.assign(me.pos, { x, z });
  me.facing = me.aim = angle;
  Object.assign(match.ball.pos, { x: x + Math.cos(angle) * 0.55, y: 0.22, z: z - Math.sin(angle) * 0.55 });
  Object.assign(match.ball.vel, { x: 0, y: 0, z: 0 });
  match.ball.owner = me;
  return me;
}

function shootFrom(x, z, targetZ, power, level = 'normal') {
  const match = createMatch({ level });
  kickOff(match);
  run(match, 0.6); // keeper gaat staan
  const angle = Math.atan2(-(targetZ - z), FIELD.halfL - x);
  withBall(match, x, z, angle);
  run(match, power * 0.8, { p1: { shoot: true } });
  run(match, 0.02, { p1: {} });
  let result = 'mis';
  run(match, 2, {}, () => {
    if (match.score[0]) result = 'goal';
    else if (match.events.some((e) => e.type === 'save')) result = 'redding';
    return result !== 'mis';
  });
  return result;
}

function rate(n, make) {
  const counts = { goal: 0, redding: 0, mis: 0 };
  for (let i = 0; i < n; i++) counts[make(i)]++;
  return counts;
}

// 1. passen naar een teamgenoot vooruit: hij krijgt de bal
const pm = createMatch();
kickOff(pm);
const mate = createPlayer({ id: 'p2', team: 0, attack: 1 });
pm.players.push(mate);
withBall(pm, -6, 0, 0);
Object.assign(mate.pos, { x: 2, z: 3 });
const got = run(pm, 2, () => ({ p1: { pass: true } }), () => pm.ball.owner === mate);
check('pass komt aan bij de teamgenoot', got);

// 2. lob: de bal gaat hoog en komt bij de teamgenoot
withBall(pm, -6, 0, 0);
Object.assign(mate.pos, { x: 4, z: -2 });
let peak = 0;
const lobbed = run(pm, 3, () => ({ p1: { lob: true } }), () => {
  peak = Math.max(peak, pm.ball.pos.y);
  return pm.ball.owner === mate;
});
check('lob gaat hoog en komt aan', lobbed && peak > 2, `(hoogste punt ${peak.toFixed(1)} m)`);

// 3. tackle: een tegenstander met de bal raakt hem kwijt en struikelt even
const tm = createMatch();
kickOff(tm);
const rival = createPlayer({ id: 'r', team: 1, attack: -1 });
tm.players.push(rival);
Object.assign(rival.pos, { x: 1.2, z: 0 });
rival.facing = Math.PI;
Object.assign(tm.ball.pos, { x: 0.65, y: 0.22, z: 0 });
tm.ball.owner = rival;
Object.assign(tm.players[0].pos, { x: -0.6, z: 0 });
tm.players[0].aim = tm.players[0].facing = 0;
const events = [];
run(tm, 0.4, () => ({ p1: { tackle: true } }), () => {
  events.push(...tm.events);
  return events.some((e) => e.type === 'tackle');
});
check('tackle tikt de bal los', tm.ball.owner !== rival && rival.stumble > 0);

// 4. tackle in het niets: zelf struikelen
const miss = createMatch();
kickOff(miss);
Object.assign(miss.players[0].pos, { x: -8, z: 5 });
miss.players[0].aim = Math.PI / 2;
run(miss, 0.4, () => ({ p1: { tackle: true } }));
check('gemiste tackle = struikelen', miss.players[0].stumble > 0);

// 5. keeper: zachte schoten recht op hem worden gevangen
const soft = rate(40, () => shootFrom(6, (Math.random() - 0.5) * 2, 0, 0.25));
check('keeper houdt zachte schoten', soft.redding >= 36, JSON.stringify(soft));

// 6. harde schoten in de hoek van 10 tot 14 meter: vaak raak, soms een duik die hem houdt
const hard = rate(60, (i) => shootFrom(1 + Math.random() * 4, (Math.random() - 0.5) * 6, i % 2 ? 2.1 : -2.1, 1));
check('harde hoekschoten: soms raak, soms gered', hard.goal >= 30 && hard.redding >= 5, JSON.stringify(hard));

// 7. per moeilijkheid scoor je makkelijker of lastiger
const mid = () => shootFrom(4 + Math.random() * 4, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4.4, 0.5 + Math.random() * 0.5);
const easy = rate(80, () => shootFrom(4 + Math.random() * 4, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4.4, 0.5 + Math.random() * 0.5, 'easy'));
const normal = rate(80, mid);
const tough = rate(80, () => shootFrom(4 + Math.random() * 4, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4.4, 0.5 + Math.random() * 0.5, 'hard'));
check('makkelijk > normaal > lastig (doelpunten)', easy.goal > normal.goal && normal.goal > tough.goal,
  `${easy.goal} / ${normal.goal} / ${tough.goal} van 80`);

// 8. keeper pakt een losse bal in zijn gebied en gooit hem weer uit
const km = createMatch();
kickOff(km);
Object.assign(km.players[0].pos, { x: -5, z: 6 });
Object.assign(km.ball.pos, { x: 12.5, y: 0.22, z: 1 });
km.ball.vel.x = 1;
const keeper = km.keepers[1];
const caught = run(km, 2, {}, () => km.ball.owner === keeper);
const thrown = caught && run(km, 2, {}, () => km.ball.owner === null && km.ball.vel.x < 0);
check('keeper pakt losse bal en gooit uit', caught && thrown);

console.log(failed ? `\n${failed} test(s) mislukt` : '\nAlles groen');
if (failed) throw new Error('tests mislukt');
