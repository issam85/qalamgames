// Laat 50 CPU-wedstrijden draaien en kijkt of het voetbal lijkt: node tools/outmatch-test-cpu.mjs
import { FIELD, STEP } from '../public/outmatch/config.js';
import { createMatch, kickOff, stepMatch } from '../public/outmatch/rules.js';

let seed = 4242;
Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

let failed = 0;
function check(name, ok, info = '') {
  console.log(`${ok ? 'ok  ' : 'FOUT'} ${name} ${info}`);
  if (!ok) failed++;
}

const MATCHES = 50;
const LENGTH = 90; // seconden, zoals een wedstrijd
const totals = { goals: [0, 0], passes: 0, shots: 0, saves: 0, tackles: 0, stuck: 0, longest: 0, bad: 0, keeperHold: 0 };
const perMatch = [];

for (let m = 0; m < MATCHES; m++) {
  const level = ['easy', 'normal', 'hard'][m % 3];
  const match = createMatch({ level, humans: [] });
  kickOff(match, m % 2);
  match.phase = 'play';
  match.time = 1e9; // hier zonder klok: alleen het voetbal zelf
  let still = 0, hold = 0;
  for (let t = 0; t < LENGTH; t += STEP) {
    const before = { ...match.ball.pos };
    stepMatch(match, {}, STEP);
    match.events.forEach((e) => {
      if (e.type === 'pass' || e.type === 'lob') totals.passes++;
      if (e.type === 'kick') totals.shots++;
      if (e.type === 'save') totals.saves++;
      if (e.type === 'tackle') totals.tackles++;
    });
    const moved = Math.hypot(match.ball.pos.x - before.x, match.ball.pos.z - before.z);
    still = moved < 0.001 && match.pause <= 0 ? still + STEP : 0;
    totals.longest = Math.max(totals.longest, still);
    hold = match.ball.owner?.keeper ? hold + STEP : 0;
    totals.keeperHold = Math.max(totals.keeperHold, hold);
    const outside = match.players.some((p) => !Number.isFinite(p.pos.x) || Math.abs(p.pos.x) > FIELD.halfL
      || Math.abs(p.pos.z) > FIELD.halfW);
    if (outside || !Number.isFinite(match.ball.pos.x)) totals.bad++;
  }
  totals.goals[0] += match.score[0];
  totals.goals[1] += match.score[1];
  perMatch.push(match.score[0] + match.score[1]);
}

const goals = totals.goals[0] + totals.goals[1];
const avg = goals / MATCHES;
console.log(`doelpunten ${totals.goals.join(' - ')}, gemiddeld ${avg.toFixed(1)} per wedstrijd`);
console.log(`passes ${totals.passes}, schoten ${totals.shots}, reddingen ${totals.saves}, tackles ${totals.tackles}`);
check('er wordt gescoord (1 tot 8 per wedstrijd)', avg >= 1 && avg <= 8, `(${avg.toFixed(1)})`);
check('beide teams scoren', totals.goals[0] > 0 && totals.goals[1] > 0);
check('geen wedstrijd zonder doelpunt in de meerderheid', perMatch.filter((g) => g === 0).length < MATCHES / 3,
  `(${perMatch.filter((g) => g === 0).length} keer 0)`);
check('er wordt gepast (> 10 per wedstrijd)', totals.passes / MATCHES > 10, `(${(totals.passes / MATCHES).toFixed(1)})`);
check('er wordt getackeld', totals.tackles / MATCHES > 2, `(${(totals.tackles / MATCHES).toFixed(1)})`);
check('de bal ligt nooit lang stil (< 6 s)', totals.longest < 6, `(langst ${totals.longest.toFixed(1)} s)`);
check('keeper houdt de bal nooit lang vast (< 2 s)', totals.keeperHold < 2, `(${totals.keeperHold.toFixed(1)} s)`);
check('niemand buiten het veld, geen rare getallen', totals.bad === 0, `(${totals.bad})`);

console.log(failed ? `\n${failed} test(s) mislukt` : '\nAlles groen');
if (failed) throw new Error('tests mislukt');
