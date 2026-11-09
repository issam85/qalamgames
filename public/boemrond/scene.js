// Tekent de kring: wie staat waar, waar is de bom en wie kijkt er bang.
import { MIDDLE } from './data.js';
import { progress } from './game.js';
import { drawKid, drawSweat } from './kid.js';
import { drawBomb } from './bomb.js';
import { drawGround, drawArrows, drawDanger, ellipsePoint } from './scene-bg.js';
import { drawName, drawKeyPrompt, drawWait, drawSpeech, drawTopBar, drawBanners } from './scene-hud.js';

const LANDSCAPE = { w: 960, h: 540, cx: 480, cy: 332, rx: 318, ry: 152 };
const PORTRAIT = { w: 540, h: 860, cx: 270, cy: 500, rx: 176, ry: 268 };
const CHEST = 44;

export function createScene(keyGlyph) {
  let view = LANDSCAPE;
  const angles = [];

  const inCircle = (g, i) => !g.players[i].out
    || (i === g.loser && (g.phase === 'boom' || g.phase === 'over'));
  const seated = (g) => g.players.map((_, i) => i).filter((i) => inCircle(g, i));
  const pos = (i) => ellipsePoint(view, angles[i] ?? 0);

  function targets(g) {
    const list = seated(g);
    const base = -Math.PI / 2 - (g.humans === 2 ? Math.PI / 3 : 0);
    const map = {};
    list.forEach((i, k) => { map[i] = base + (k * Math.PI * 2) / list.length; });
    return map;
  }

  function update(g, dt) {
    const map = targets(g);
    Object.entries(map).forEach(([i, target]) => {
      if (angles[i] === undefined) angles[i] = target;
      let d = (target - angles[i]) % (Math.PI * 2);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      angles[i] += d * Math.min(1, dt * 5);
    });
  }

  function bombPos(g) {
    const { flight } = g;
    if (flight) {
      const a = pos(flight.from);
      const b = pos(flight.to);
      const k = Math.min(1, flight.t / flight.dur);
      return {
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k - CHEST - Math.sin(k * Math.PI) * 74,
      };
    }
    const h = pos(g.holder);
    if (g.drop > 0) return { x: h.x + 34, y: h.y - 12 };
    return { x: h.x, y: h.y - CHEST };
  }

  function poseOf(g, i, bomb, t) {
    const p = pos(i);
    const dist = Math.hypot(bomb.x - p.x, bomb.y + 60 - p.y) || 1;
    const look = [(bomb.x - p.x) / dist, (bomb.y + 60 - p.y) / dist];
    if (g.players[i].out) return { mood: 'soot', arms: 'down', look };
    if (g.phase !== 'play' && g.phase !== 'intro') return { mood: 'happy', arms: 'down', look };
    const { flight } = g;
    if (flight?.from === i) return { mood: 'happy', arms: 'throw', look };
    if (flight?.to === i) return { mood: 'scared', arms: 'up', look };
    if (!flight && g.holder === i && g.drop <= 0) {
      const wobble = Math.sin(t * 34) * (1 + progress(g) * 2);
      return { mood: 'scared', arms: 'hold', look, wobble };
    }
    return { mood: 'happy', arms: 'down', look };
  }

  function drawPerson(c, g, i, bomb, t) {
    const p = pos(i);
    const player = g.players[i];
    const pose = poseOf(g, i, bomb, t);
    drawKid(c, player.kid, p.x + (pose.wobble || 0), p.y, 1, pose);
    if (pose.arms === 'hold' && progress(g) > 0.35) drawSweat(c, p.x, p.y, t);
    drawName(c, player, p.x, p.y);
    if (player.human < 0 || player.out || g.phase !== 'play') return;
    if (!g.flight && g.holder === i && g.drop <= 0) {
      drawKeyPrompt(c, keyGlyph(player.human, g.humans), p.x, Math.max(36, p.y - 142), t);
    } else if (g.flight?.to === i) {
      drawWait(c, p.x, Math.max(30, p.y - 134));
    }
  }

  function draw(c, g, t) {
    const v = view;
    const p = g.phase === 'play' ? progress(g) : 0;
    const lit = (g.blink % 1) < 0.55;
    const showBomb = g.phase === 'play' || g.phase === 'intro' || g.phase === 'menu';
    const bomb = bombPos(g);
    drawGround(c, v);
    drawArrows(c, v, seated(g).map((i) => angles[i] ?? 0));
    drawTopBar(c, v, g);
    const order = [...seated(g), 'mid'].sort((a, b) => (a === 'mid' ? v.cy + 16 : pos(a).y)
      - (b === 'mid' ? v.cy + 16 : pos(b).y));
    order.forEach((who) => {
      if (who === 'mid') drawKid(c, MIDDLE, v.cx, v.cy + 16, 0.82, { seated: true, look: [0.5, -0.4] });
      else drawPerson(c, g, who, bomb, t);
    });
    if (showBomb) drawBomb(c, bomb.x, bomb.y, 19 + p * 5, lit, t);
    if (g.phase === 'play') drawSpeech(c, v, p > 0.85 ? 'TIKTAK!' : Math.floor(g.blink) % 2 ? 'TAK…' : 'TIK…', p > 0.85);
    drawDanger(c, v, p, lit);
    return v;
  }

  return {
    update,
    draw,
    drawBanners: (c, g, touch) => drawBanners(c, view, g, touch),
    pos,
    setPortrait(portrait) { view = portrait ? PORTRAIT : LANDSCAPE; return view; },
    get view() { return view; },
  };
}
