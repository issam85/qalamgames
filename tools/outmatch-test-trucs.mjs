// Test de trucs van OutMatch (flip reset en Jezusloop) zonder beeld: node tools/outmatch-test-trucs.mjs
import { STEP, FIELD, TRICK } from '../public/outmatch/config.js';
import { createMatch, stepMatch } from '../public/outmatch/rules.js';

let seed = 99;
Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${name} ${info}`);
  if (!ok) failed++;
}

// alleen P1 en de keepers; others = ook de andere spelers
function setup(others = false, level = 'easy') {
  const match = createMatch({ level });
  if (!others) match.players = match.players.filter((p) => !p.cpu);
  Object.assign(match, { phase: 'play', kickWait: 0 });
  return { match, me: match.players.find((p) => p.id === 'p1') };
}

function withBall(match, me, x, z, angle) {
  Object.assign(me.pos, { x, z });
  me.facing = me.aim = angle;
  Object.assign(match.ball.pos, { x: x + Math.cos(angle) * 0.55, y: 0.22, z: z - Math.sin(angle) * 0.55 });
  Object.assign(match.ball.vel, { x: 0, y: 0, z: 0 });
  match.ball.owner = me;
}

const events = [];
function run(match, seconds, intent = {}, until = () => false) {
  for (let t = 0; t < seconds; t += STEP) {
    stepMatch(match, { p1: typeof intent === 'function' ? intent() : intent }, STEP);
    events.push(...match.events);
    if (until()) return true;
  }
  return false;
}

// P1 schiet de bal schuin tegen de zijkant en loopt erachteraan tot hij hem weer heeft
function rebound() {
  const { match, me } = setup();
  withBall(match, me, 0, 5, Math.PI / 2 - 0.25); // bijna recht naar de zijkant (z = -9 is +angle)
  run(match, 0.2, { shoot: true });
  run(match, 0.01, {});
  const got = run(match, 2.5, () => {
    const b = match.ball.pos;
    const dx = b.x - me.pos.x, dz = b.z - me.pos.z, len = Math.hypot(dx, dz) || 1;
    return { x: dx / len, z: dz / len };
  }, () => match.ball.owner === me);
  return { match, me, got };
}

events.length = 0;
const r = rebound();
check('je neemt je eigen kaatsbal weer aan', r.got);
check('dan begint de flip reset', r.me.flip > 2 && events.some((e) => e.type === 'flip'), `(${r.me.flip.toFixed(2)} s)`);
run(r.match, TRICK.flip + 0.1, { x: 0, z: 0 });
check('na 3 seconden is hij voorbij', r.me.flip === 0);

// krulschot: hoeveel gaan erin, vergeleken met een gewoon schot van dezelfde plek
function shots(flip, level) {
  let goals = 0, bent = 0;
  for (let n = 0; n < 40; n++) {
    const { match, me } = setup(false, level);
    run(match, 0.5);
    const x = 6 + (n % 4), z = (n % 5) - 2;
    const target = (n % 2 ? 1 : -1) * 1.5; // in de hoek
    withBall(match, me, x, z, Math.atan2(-(target - z), FIELD.halfL - x));
    me.flip = flip ? 2 : 0;
    run(match, 0.5, { shoot: true });
    run(match, 0.01, {});
    const start = Math.atan2(-match.ball.vel.z, match.ball.vel.x);
    run(match, 0.15, {});
    if (Math.abs(Math.atan2(-match.ball.vel.z, match.ball.vel.x) - start) > 0.03) bent++;
    run(match, 2, {}, () => match.score[0] > 0);
    if (match.score[0]) goals++;
  }
  return { goals, bent };
}
const plain = shots(false, 'hard'), curled = shots(true, 'hard');
console.log(`keeper op moeilijk: gewoon schot ${plain.goals}/40 raak, krulschot ${curled.goals}/40 raak`);
check('een krulschot buigt', curled.bent > 30 && plain.bent < 3, `(${curled.bent} / ${plain.bent})`);
check('een krulschot gaat vaker raak dan een gewoon schot', curled.goals > plain.goals);
check('maar niet altijd', curled.goals < 40);

// Jezusloop: na de kaatsbal op Lob drukken
events.length = 0;
const j = rebound();
run(j.match, 0.05, { lob: true });
check('Lob na de kaatsbal = Jezusloop', j.me.air > 4.5 && events.some((e) => e.type === 'jesus'));
run(j.match, 0.6, { x: 0.3, z: 0 });
check('je loopt boven de anderen uit', j.me.y > 1.1 && j.match.ball.pos.y > 1.2, `(${j.me.y.toFixed(2)} m)`);
check('met de bal', j.match.ball.owner === j.me);
run(j.match, 5, { x: -0.3, z: 0 });
check('na 5 seconden land je, met de bal aan je voet', j.me.air === 0 && j.me.y < 0.05 && j.match.ball.owner === j.me);
const again = rebound();
again.me.jesusUsed = true;
run(again.match, 0.05, { lob: true });
check('maar één keer per wedstrijd', again.me.air === 0);

// in de lucht kan niemand je tackelen
const t = setup(true);
const rival = t.match.players.find((p) => p.team === 1);
withBall(t.match, t.me, 0, 0, 0);
Object.assign(t.me, { air: TRICK.air, y: TRICK.height, jesusUsed: true });
let lost = false;
run(t.match, 3, () => {
  Object.assign(rival.pos, { x: t.me.pos.x + 0.9, z: t.me.pos.z });
  rival.facing = rival.aim = Math.PI;
  rival.tackle = rival.tackle > 0 ? rival.tackle : 0.3;
  return { x: 0.2, z: 0 };
}, () => { lost = t.match.ball.owner !== t.me; return lost; });
check('tackelen in de lucht lukt niet', !lost);

// schieten uit de lucht: de bal gaat omlaag, op doelhoogte
let airGoals = 0;
for (let n = 0; n < 12; n++) {
  const a = setup();
  run(a.match, 0.5);
  const z = (n % 3) - 1, target = n % 2 ? 1.5 : -1.5;
  withBall(a.match, a.me, 4 + (n % 4), z, Math.atan2(-(target - z), FIELD.halfL - 4));
  Object.assign(a.me, { air: TRICK.air, y: TRICK.height, jesusUsed: true });
  run(a.match, 0.5, { shoot: true });
  run(a.match, 2, {}, () => a.match.score[0] > 0);
  if (a.match.score[0]) airGoals++;
}
check('uit de lucht kun je scoren', airGoals >= 3, `(${airGoals}/12)`);

console.log(failed ? `\n${failed} test(s) mislukt` : '\nAlles groen');
if (failed) throw new Error('tests mislukt');
