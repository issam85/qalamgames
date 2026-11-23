// De werelden: elk één groot level aan één stuk tot 100%, in stukken die steeds moeilijker worden.
import { row, rhythm, stairs, shelf, tunnel, padOver, towers, ringChain } from './patterns.js';
import { flight } from './patterns-fly.js';
import { sawRow, sawTowers, maceRow } from './patterns-hazards.js';
import { upsideDown } from './patterns-flip.js';
import { lampWalls, lampBridges, lampOrbs, lampStairs, lampFlight } from './patterns-lamps.js';

const AIR = 0.548; // zo lang duurt een gewone sprong
const LEAD_IN = 14; // vrije aanloop
const CHECKPOINT_BACK = 3; // minstens zo ver vóór een stukje begin je na een botsing
const LIFE_W1 = [0.17, 0.33, 0.5, 0.67, 0.83]; // wereld 1: vaker een checkpoint
const LIFE = [0.2, 0.4, 0.6, 0.8];

// kleuren per stuk: muur, vloer en de lichtlijnen langs de baan
const NIGHT = { wall: '#4a35ac', floor: '#5a44c8', glow: '#38e8d8' };
const TEAL = { wall: '#14808f', floor: '#127082', glow: '#ffd43b' };
const ROSE = { wall: '#a02c78', floor: '#8a2468', glow: '#7fffd4' };
const AMBER = { wall: '#b05a24', floor: '#8e4a1e', glow: '#7fd3ff' };
const GREEN = { wall: '#1f8a5a', floor: '#1a7048', glow: '#ffe28a' };
const CRIMSON = { wall: '#a8323c', floor: '#842830', glow: '#ffd43b' };

// lifeAt: waar de checkpoints van Start ongeveer liggen (deel van de lengte)
function buildWorld(name, style, lifeAt, sections) {
  const zones = [];
  const parts = [];
  const checkpoints = [];
  const portals = [{ x: 0, mode: 'run' }];
  let x = LEAD_IN;
  sections.forEach(({ title, colors, speed, rest, pieces }, i) => {
    zones.push({ x: i ? x - 2 : 0, title, speed, ...colors });
    const tempo = { speed, jump: speed * AIR };
    pieces.forEach((piece) => {
      const made = piece(x, tempo);
      // ruim vóór het stukje, zodat je na terugkomen eerst even rustig loopt
      if (!made.noCheckpoint) checkpoints.push(x - Math.min(rest - 0.6, Math.max(CHECKPOINT_BACK, speed * 0.8)));
      parts.push(...made.parts);
      portals.push(...(made.portals || []));
      x += made.width + rest;
    });
  });
  const length = x + 8;
  // de veilige plek die het dichtst bij elk punt uit lifeAt ligt
  const closest = (spot) => checkpoints.reduce((a, b) => (Math.abs(b - spot) < Math.abs(a - spot) ? b : a));
  const lifeCheckpoints = [...new Set(lifeAt.map((part) => closest(part * length)))];
  return { name, style, length, zones, portals, checkpoints, lifeCheckpoints, obstacles: parts.sort((a, b) => a.x - b.x) };
}

const WORLD_1 = buildWorld('Lantaarnstad', 'stad', LIFE_W1, [
  { title: 'De straat', colors: NIGHT, speed: 9, rest: 8, pieces: [
    row(1), row(1), row(2), row(1), row(2), row(2), rhythm(2), row(2), row(1), row(2), row(2),
  ] },
  { title: 'Over de daken', colors: TEAL, speed: 9.5, rest: 7, pieces: [
    stairs(3), row(2), shelf(9, 1), row(2), stairs(3), rhythm(4), padOver(), row(2), shelf(11, 1),
    stairs(4), row(2), sawRow(2), padOver(),
  ] },
  { title: 'Het vliegende tapijt', colors: ROSE, speed: 9.5, rest: 6, pieces: [
    flight(5, 3), row(2), flight(4, 3),
  ] },
  { title: 'Ondersteboven', colors: AMBER, speed: 10, rest: 6, pieces: [
    upsideDown(4, 1),
  ] },
  { title: 'De doornentuin', colors: GREEN, speed: 10, rest: 6, pieces: [
    towers(3, 1, 3), row(2), ringChain(1), sawRow(2), towers(4, 1, 3), ringChain(2), maceRow(1), tunnel(5),
    row(2), sawTowers(3, 1, 3), ringChain(2), row(2), stairs(4, true), towers(5, 1, 2), maceRow(2), row(2),
  ] },
]);

const WORLD_2 = buildWorld('Sterrenbazaar', 'bazaar', LIFE, [
  { title: 'De markt', colors: ROSE, speed: 10, rest: 6, pieces: [
    row(2), rhythm(4), sawRow(3), stairs(3), shelf(11, 2), rhythm(5, 2), padOver(), tunnel(6), maceRow(2),
    towers(4, 1, 3), row(3), stairs(4, true),
  ] },
  { title: 'De lichtjes', colors: AMBER, speed: 10.75, rest: 5, pieces: [
    ringChain(2), row(3), sawTowers(5, 1, 2), rhythm(5), tunnel(7), maceRow(2), towers(4, 3, 2), ringChain(3),
    shelf(13, 2), row(3), padOver(), stairs(4, true), ringChain(3), rhythm(4, 2),
  ] },
  { title: 'Over de markt vliegen', colors: GREEN, speed: 11, rest: 5, pieces: [
    flight(7, 3), rhythm(4), flight(6, 2, { spiky: true }),
  ] },
  { title: 'Op het plafond', colors: CRIMSON, speed: 11, rest: 5, pieces: [
    upsideDown(6, 2),
  ] },
  { title: 'Het dakterras', colors: TEAL, speed: 11.5, rest: 4, pieces: [
    sawTowers(6, 1, 2), maceRow(3), ringChain(3), tunnel(7), rhythm(6), towers(5, 3, 2), sawRow(3), stairs(4, true),
    ringChain(4), shelf(14, 2), rhythm(5, 2), towers(6, 1, 1), row(3), padOver(), ringChain(4),
  ] },
]);

const WORLD_3 = buildWorld('Hemelpaleis', 'paleis', LIFE, [
  { title: 'De poort', colors: CRIMSON, speed: 11.5, rest: 4, pieces: [
    rhythm(6), sawTowers(5, 1, 2), sawRow(4), ringChain(3), stairs(4, true), tunnel(8), maceRow(3),
    towers(5, 3, 2), padOver(), shelf(15, 2), ringChain(4), row(3),
  ] },
  { title: 'De sterrenzaal', colors: NIGHT, speed: 12.25, rest: 4, pieces: [
    sawTowers(7, 1, 1), maceRow(3), ringChain(4), rhythm(7), tunnel(8), sawRow(4), towers(6, 3, 2), stairs(4, true),
    ringChain(5), rhythm(6, 2), shelf(16, 2), padOver(), towers(7, 1, 1), row(3), ringChain(5),
  ] },
  { title: 'Door de wolken', colors: TEAL, speed: 12.5, rest: 4, pieces: [
    flight(8, 2, { saws: true }), rhythm(5), flight(7, 2, { spiky: true }), row(3), flight(6, 2, { spiky: true, saws: true }),
  ] },
  { title: 'Ondersteboven door het paleis', colors: ROSE, speed: 12.5, rest: 4, pieces: [
    upsideDown(8, 3), row(3), upsideDown(6, 3),
  ] },
  { title: 'De top', colors: AMBER, speed: 13, rest: 5, pieces: [
    rhythm(8), sawTowers(8, 1, 1), ringChain(5), maceRow(4), tunnel(9), rhythm(7, 2), sawTowers(7, 3, 2),
    stairs(4, true), ringChain(6), row(3), towers(8, 1, 1), padOver(), rhythm(8), ringChain(6),
    shelf(18, 2), towers(9, 1, 1), row(3),
  ] },
]);

// wereld 4: kleurlampen. Alleen de kleur die aan staat is vast (lamps.js)
const WORLD_4 = buildWorld('Woestijnoase', 'oase', LIFE, [
  { title: 'De oase', colors: AMBER, speed: 10, rest: 6, pieces: [
    lampWalls(4), row(2), lampBridges(3), stairs(3), lampStairs(3), shelf(11, 2), lampBridges(4),
    padOver(), lampOrbs(3), lampStairs(4), ringChain(2),
  ] },
  { title: 'De karavaan', colors: GREEN, speed: 10.5, rest: 5, pieces: [
    lampBridges(5, true), sawRow(3), lampOrbs(4), tunnel(6), lampStairs(5), maceRow(2), ringChain(3),
    lampBridges(5, true), lampStairs(5, true), towers(4, 1, 2), lampOrbs(5),
  ] },
  { title: 'Over de duinen vliegen', colors: ROSE, speed: 11, rest: 5, pieces: [
    flight(6, 3), lampFlight(5), rhythm(4), lampFlight(6, true),
  ] },
  { title: 'Ondersteboven in de oase', colors: TEAL, speed: 11, rest: 5, pieces: [
    upsideDown(6, 2),
  ] },
  { title: 'De sterrenbron', colors: CRIMSON, speed: 11.5, rest: 4, pieces: [
    lampStairs(6, true), sawTowers(5, 1, 2), lampOrbs(6), maceRow(3), lampBridges(6, true), ringChain(4),
    tunnel(7), lampStairs(6), lampOrbs(6), lampStairs(7, true), row(3),
  ] },
]);

// keuze gebruiker (23 nov): alle werelden meteen te spelen, zonder eerst de vorige te halen
[WORLD_1, WORLD_2, WORLD_3, WORLD_4].forEach((world) => { world.open = true; });

export const WORLDS = [WORLD_1, WORLD_2, WORLD_3, WORLD_4];
