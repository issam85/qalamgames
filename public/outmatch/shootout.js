// Penalty's na een gelijkspel: om en om, eerst 3 per team, daarna tot er een verschil is.
import { MATCH } from './config.js';

export function createShootout(first = 0) {
  return { kicks: [[], []], turn: first, winner: null };
}

const goals = (list) => list.filter(Boolean).length;

// is er al een winnaar? ook als de ander het niet meer kan inhalen
function decide(so) {
  const [a, b] = so.kicks;
  const ga = goals(a), gb = goals(b);
  const leftA = Math.max(0, MATCH.penalties - a.length), leftB = Math.max(0, MATCH.penalties - b.length);
  if (a.length <= MATCH.penalties && b.length <= MATCH.penalties) {
    if (ga + leftA < gb) return 1;
    if (gb + leftB < ga) return 0;
  }
  if (a.length === b.length && a.length >= MATCH.penalties && ga !== gb) return ga > gb ? 0 : 1;
  return null;
}

// telt de penalty voor het team van de schutter; daarna is het andere team
export function recordKick(so, team, scored) {
  so.kicks[team].push(scored);
  so.turn = 1 - team;
  so.winner = decide(so);
  return so.winner;
}

export function shootoutScore(so) {
  return so.kicks.map(goals);
}
