// De spelregels, zonder tekenen of geluid (zo te testen). Spelers zitten op volgorde
// in de kring; de bom gaat altijd naar de volgende die nog meedoet.
import { cpuPlan } from './cpu.js';

export const FUSE_MIN = 12;
export const FUSE_MAX = 30;
const INTRO = 1.8;
const BOOM = 2.6;
const DROP = 0.8; // zo lang ben je de bom kwijt als je hem laat vallen
const GRACE = 0.07; // zo kort voor de landing telt een druk nog als goed

export const progress = (g) => Math.min(1, g.elapsed / g.fuse);
const alive = (g) => g.players.filter((p) => !p.out);
const emit = (g, type, data = {}) => g.events.push({ type, ...data });

export function nextAlive(g, i) {
  const n = g.players.length;
  for (let k = 1; k <= n; k++) {
    const j = (i + k) % n;
    if (!g.players[j].out) return j;
  }
  return i;
}

export function startRound(g) {
  const first = g.loser >= 0 ? nextAlive(g, g.loser)
    : g.players.indexOf(alive(g)[Math.floor(g.rng() * alive(g).length)]);
  g.round += 1;
  g.phase = 'intro';
  g.timer = INTRO;
  g.fuse = FUSE_MIN + g.rng() * (FUSE_MAX - FUSE_MIN);
  g.elapsed = 0;
  g.blink = 0;
  g.holder = first;
  g.flight = null;
  g.drop = 0;
  g.wait = cpuPlan(0, g.rng).hold;
  emit(g, 'round');
}

function throwBomb(g, from) {
  const to = nextAlive(g, from);
  const dur = 0.55 - 0.27 * progress(g);
  g.flight = { from, to, t: 0, dur, early: false, buffered: false };
  emit(g, 'throw', { from, to });
}

function land(g) {
  const { to, early, buffered } = g.flight;
  g.flight = null;
  g.holder = to;
  if (g.players[to].human >= 0) {
    if (early) {
      g.drop = DROP;
      emit(g, 'drop', { who: to });
    } else if (buffered) {
      throwBomb(g, to);
    }
    return;
  }
  const plan = cpuPlan(progress(g), g.rng);
  g.wait = plan.hold;
  if (plan.drops) {
    g.drop = DROP;
    emit(g, 'drop', { who: to });
  }
}

function explode(g) {
  // Ontploft hij in de lucht, dan is de ontvanger de pineut: doorgeven is doorgeven.
  const loser = g.flight ? g.flight.to : g.holder;
  g.flight = null;
  g.holder = loser;
  g.loser = loser;
  g.players[loser].place = alive(g).length;
  g.players[loser].out = true;
  g.phase = 'boom';
  g.timer = BOOM;
  emit(g, 'boom', { who: loser });
}

function isFinished(g) {
  const left = alive(g);
  return left.length === 1 || !left.some((p) => p.human >= 0);
}

function finish(g) {
  const left = alive(g);
  if (left.length === 1) left[0].place = 1;
  g.phase = 'over';
  emit(g, 'over');
}

function play(g, dt) {
  g.elapsed += dt;
  if (g.elapsed >= g.fuse) {
    explode(g);
    return;
  }
  const p = progress(g);
  const before = Math.floor(g.blink);
  g.blink += dt * (1.4 + 9.6 * p * p);
  if (Math.floor(g.blink) > before) emit(g, 'tick', { n: Math.floor(g.blink) });
  if (g.flight) {
    g.flight.t += dt;
    if (g.flight.t >= g.flight.dur) land(g);
  } else if (g.drop > 0) {
    g.drop -= dt;
  } else if (g.players[g.holder].human < 0) {
    g.wait -= dt;
    if (g.wait <= 0) throwBomb(g, g.holder);
  }
}

export function step(g, dt) {
  if (g.phase === 'menu') {
    g.blink += dt * 1.4;
  } else if (g.phase === 'intro') {
    g.timer -= dt;
    if (g.timer <= 0) {
      g.phase = 'play';
      emit(g, 'go');
    }
  } else if (g.phase === 'boom') {
    g.timer -= dt;
    if (g.timer <= 0) {
      if (isFinished(g)) finish(g);
      else startRound(g);
    }
  } else if (g.phase === 'play') {
    play(g, dt);
  }
}

// Een speler drukt. Te vroeg (de bom vliegt nog naar je toe) = je laat hem straks vallen.
export function press(g, human) {
  if (g.phase !== 'play') return;
  const i = g.players.findIndex((p) => p.human === human && !p.out);
  if (i < 0) return;
  if (g.flight) {
    if (g.flight.to !== i || g.flight.early) return;
    if (g.flight.dur - g.flight.t <= GRACE) {
      g.flight.buffered = true;
    } else {
      g.flight.early = true;
      emit(g, 'early', { who: i });
    }
  } else if (g.holder === i && g.drop <= 0) {
    throwBomb(g, i);
  }
}
