// Test het wedstrijdverloop van OutMatch: klok, blessuretijd, penalty's en het einde.
// node tools/outmatch-test-wedstrijd.mjs
import { STEP, MATCH } from '../public/outmatch/config.js';
import { createMatch, resetMatch, stepMatch, winnerOf } from '../public/outmatch/rules.js';
import { createShootout, recordKick } from '../public/outmatch/shootout.js';
import { setupKick, stepKick } from '../public/outmatch/penalty.js';
import { setHumans } from '../public/outmatch/teams.js';

// vaste toevalsgetallen (mulberry32), zodat de test elke keer hetzelfde uitkomt
let seed = 777;
Math.random = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${name} ${info}`);
  if (!ok) failed++;
}

// 1. een hele CPU-wedstrijd: speeltijd, blessuretijd, einde (eventueel via penalty's)
let ended = 0, viaPens = 0, extrasOk = true, lengthOk = true;
for (let m = 0; m < 12; m++) {
  const match = createMatch({ humans: [] });
  resetMatch(match);
  const seen = new Set();
  let t = 0;
  while (match.phase !== 'end' && t < 400) {
    stepMatch(match, {}, STEP);
    seen.add(match.phase);
    t += STEP;
  }
  if (match.phase === 'end') ended++;
  if (seen.has('penalties')) viaPens++;
  if (!MATCH.extras.includes(match.extra)) extrasOk = false;
  if (Math.abs(match.elapsed - (MATCH.length + match.extra)) > 0.05) lengthOk = false;
  if (winnerOf(match) === null) lengthOk = false; // er is altijd een winnaar
}
check('12 wedstrijden lopen af met een winnaar', ended === 12 && lengthOk, `(${viaPens} via penalty's)`);
check('blessuretijd is 10 of 20 s', extrasOk);

// 2. de volgorde van de penalty's
const play = (list, first = 0) => {
  const so = createShootout(first);
  let i = 0;
  while (so.winner === null && i < list.length) recordKick(so, so.turn, list[i++]);
  return { winner: so.winner, kicks: i };
};
check('2-0 na vier: niet meer in te halen, team 0 wint', JSON.stringify(play([1, 0, 1, 0, 1, 0])) === '{"winner":0,"kicks":4}');
check('gelijk na 3: door tot er een verschil is', JSON.stringify(play([1, 1, 0, 0, 1, 1, 1, 0])) === '{"winner":0,"kicks":8}');
check('team 1 begint en wint', play([1, 0, 1, 0, 1, 0], 1).winner === 1);

// 3. een penalty van speler 1: drukken als de pijl in een hoek staat
function humanKick(aimTarget, power, level = 'normal') {
  const match = createMatch({ level });
  const kick = setupKick(match, 0, 0);
  let pressed = false;
  for (let t = 0; t < 8; t += STEP) {
    let press = false;
    if (kick.stage === 'aim' && Math.abs(kick.aimZ - aimTarget) < 0.08 && !pressed) press = true;
    if (kick.stage === 'power' && Math.abs(kick.power - power) < 0.03 && kick.t > 0.05) press = true;
    if (stepKick(match, kick, press)) break;
    pressed = press;
  }
  return kick.result;
}
const corner = { goal: 0, save: 0, mis: 0 };
for (let i = 0; i < 40; i++) corner[humanKick(i % 2 ? 1.9 : -1.9, 0.6)]++;
check('hoekpenalty met halve kracht: meestal raak', corner.goal >= 20 && corner.save >= 5, JSON.stringify(corner));
const middle = { goal: 0, save: 0, mis: 0 };
for (let i = 0; i < 40; i++) middle[humanKick(0, 0.5)]++;
check('penalty door het midden: vaak gehouden', middle.save >= 12, JSON.stringify(middle));
const tooHard = { goal: 0, save: 0, mis: 0 };
for (let i = 0; i < 20; i++) tooHard[humanKick(1.2, 0.99)]++;
check('volle kracht: over de lat', tooHard.mis >= 15, JSON.stringify(tooHard));

// 4. twee spelers in één team: aan- en uitzetten, en om en om de penalty's
const duo = createMatch({ humans: ['p1'] });
setHumans(duo.players, ['p1', 'p2']);
const ids = duo.players.filter((p) => !p.cpu).map((p) => `${p.id}:${p.role}`).sort().join();
check('twee spelers: p1 rechts, p2 links', ids === 'p1:rechts,p2:links', ids);
const takers = [0, 1, 2].map((r) => setupKick(duo, 0, r).shooter.id).join();
check('penalty\'s om en om door P1 en P2', takers === 'p1,p2,p1', takers);
resetMatch(duo);
for (let i = 0; i < 20 / STEP; i++) stepMatch(duo, { p1: {}, p2: {} }, STEP);
check('twee spelers: wedstrijd loopt', duo.phase === 'play' && duo.time < MATCH.length, `${duo.time.toFixed(1)}`);
setHumans(duo.players, ['p1']);
const back = duo.players.filter((p) => !p.cpu).map((p) => p.id).join();
const sami = duo.players.find((p) => p.role === 'links' && p.team === 0);
check('terug naar één speler: P2 wordt weer CPU', back === 'p1' && sami.id === 'c01' && sami.name === 'Sami', `${back} ${sami.id} ${sami.name}`);

console.log(failed ? `\n${failed} test(s) mislukt` : '\nAlles groen');
if (failed) throw new Error('tests mislukt');
