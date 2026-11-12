// De werelden: elk één groot level aan één stuk tot 100%, in stukken die steeds moeilijker worden.
import { row, rhythm, stairs, shelf, tunnel, padOver, towers, ringChain } from './patterns.js';
import { flight } from './patterns-fly.js';

const AIR = 0.548; // zo lang duurt een gewone sprong
const LEAD_IN = 14; // vrije aanloop
const CHECKPOINT_BACK = 3; // zo ver vóór een stukje begin je in de oefenmodus

// kleuren per stuk: muur, vloer en de lichtlijnen langs de baan
const NIGHT = { wall: '#4a35ac', floor: '#5a44c8', glow: '#38e8d8' };
const TEAL = { wall: '#14808f', floor: '#127082', glow: '#ffd43b' };
const ROSE = { wall: '#a02c78', floor: '#8a2468', glow: '#7fffd4' };
const AMBER = { wall: '#b05a24', floor: '#8e4a1e', glow: '#7fd3ff' };
const GREEN = { wall: '#1f8a5a', floor: '#1a7048', glow: '#ffe28a' };
const CRIMSON = { wall: '#a8323c', floor: '#842830', glow: '#ffd43b' };

function buildWorld(name, sections) {
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
      if (!made.noCheckpoint) checkpoints.push(x - Math.min(rest - 0.6, CHECKPOINT_BACK));
      parts.push(...made.parts);
      portals.push(...(made.portals || []));
      x += made.width + rest;
    });
  });
  const length = x + 8;
  // de veilige plek die het dichtst bij 20, 40, 60 en 80% ligt
  const closest = (spot) => checkpoints.reduce((a, b) => (Math.abs(b - spot) < Math.abs(a - spot) ? b : a));
  const lifeCheckpoints = [0.2, 0.4, 0.6, 0.8].map((part) => closest(part * length));
  return { name, length, zones, portals, checkpoints, lifeCheckpoints, obstacles: parts.sort((a, b) => a.x - b.x) };
}

const WORLD_1 = buildWorld('Lantaarnstad', [
  { title: 'De straat', colors: NIGHT, speed: 9, rest: 8, pieces: [
    row(1), row(1), row(2), row(1), row(2), row(2), rhythm(3), row(3), row(1), row(2), row(3),
  ] },
  { title: 'Over de daken', colors: TEAL, speed: 9.5, rest: 7, pieces: [
    stairs(3), row(2), shelf(9, 1), row(3), stairs(3), rhythm(4), padOver(), row(3), shelf(11, 1),
    stairs(4), row(2), padOver(),
  ] },
  { title: 'Het vliegende tapijt', colors: ROSE, speed: 9.5, rest: 6, pieces: [
    flight(5, 3), row(2), flight(4, 3),
  ] },
  { title: 'De doornentuin', colors: GREEN, speed: 10, rest: 6, pieces: [
    towers(3, 1, 3), row(3), ringChain(1), row(2), towers(4, 1, 3), ringChain(2), rhythm(4), tunnel(5),
    row(3), towers(3, 3, 3), ringChain(2), row(3), stairs(4, true), towers(5, 1, 2), row(3),
  ] },
]);

const WORLD_2 = buildWorld('Sterrenbazaar', [
  { title: 'De markt', colors: ROSE, speed: 10, rest: 6, pieces: [
    row(2), rhythm(4), row(3), stairs(3), shelf(11, 2), rhythm(5, 2), padOver(), tunnel(6), row(3),
    towers(4, 1, 3), row(3), stairs(4, true),
  ] },
  { title: 'De lichtjes', colors: AMBER, speed: 10.75, rest: 5, pieces: [
    ringChain(2), row(3), towers(5, 1, 2), rhythm(5), tunnel(7), row(3), towers(4, 3, 2), ringChain(3),
    shelf(13, 2), row(3), padOver(), stairs(4, true), ringChain(3), rhythm(4, 2),
  ] },
  { title: 'Over de markt vliegen', colors: GREEN, speed: 11, rest: 5, pieces: [
    flight(7, 3), rhythm(4), flight(6, 2),
  ] },
  { title: 'Het dakterras', colors: TEAL, speed: 11.5, rest: 4, pieces: [
    towers(6, 1, 2), row(3), ringChain(3), tunnel(7), rhythm(6), towers(5, 3, 2), row(3), stairs(4, true),
    ringChain(4), shelf(14, 2), rhythm(5, 2), towers(6, 1, 1), row(3), padOver(), ringChain(4),
  ] },
]);

const WORLD_3 = buildWorld('Hemelpaleis', [
  { title: 'De poort', colors: CRIMSON, speed: 11.5, rest: 4, pieces: [
    rhythm(6), towers(5, 1, 2), row(3), ringChain(3), stairs(4, true), tunnel(8), rhythm(5, 2),
    towers(5, 3, 2), padOver(), shelf(15, 2), ringChain(4), row(3),
  ] },
  { title: 'De sterrenzaal', colors: NIGHT, speed: 12.25, rest: 3.5, pieces: [
    towers(7, 1, 1), row(3), ringChain(4), rhythm(7), tunnel(8), row(3), towers(6, 3, 2), stairs(4, true),
    ringChain(5), rhythm(6, 2), shelf(16, 2), padOver(), towers(7, 1, 1), row(3), ringChain(5),
  ] },
  { title: 'Door de wolken', colors: TEAL, speed: 12.5, rest: 3.5, pieces: [
    flight(8, 2), rhythm(5), flight(7, 2), row(3), flight(6, 2),
  ] },
  { title: 'De top', colors: AMBER, speed: 13, rest: 3, pieces: [
    rhythm(8), towers(8, 1, 1), ringChain(5), row(3), tunnel(9), rhythm(7, 2), towers(7, 3, 2),
    stairs(4, true), ringChain(6), row(3), towers(8, 1, 1), padOver(), rhythm(8), ringChain(6),
    shelf(18, 2), towers(9, 1, 1), row(3),
  ] },
]);

export const WORLDS = [WORLD_1, WORLD_2, WORLD_3];
