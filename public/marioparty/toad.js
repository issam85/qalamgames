// Toad deelt na elke minigame de sterren en punten uit: hij wijst en klapt,
// sterren vliegen naar de kaarten van de winnaars en de punten tellen op.
import { AWARDS } from './board.js';
import { renderHud } from './hud.js';
import { createSprite, play, update, drawSprite } from './sprites.js';

const canvas = document.getElementById('toad-canvas');
const bubble = document.getElementById('toad-bubble');
const cardsBox = document.getElementById('toad-cards');
const FLY_MS = 700;

let toad = null;

function stars(n) {
  return `${n} ${n === 1 ? 'ster' : 'sterren'}`;
}

function awardLine(player, award) {
  return `${player.character.name}: ${stars(award.stars)} en ${award.points} punten!`;
}

function frame(now) {
  const time = now / 1000;
  update(toad.sprite, Math.min(0.05, time - toad.time));
  toad.time = time;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSprite(ctx, toad.sprite, canvas.width / 2, canvas.height - 12, 150);
  toad.raf = requestAnimationFrame(frame);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function center(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// een ster vliegt in een boog van Toad naar het sterren-getal op de kaart
async function flyStar(target) {
  const star = document.createElement('img');
  star.src = 'img/star.png';
  star.className = 'fly-star';
  document.body.appendChild(star);
  const from = center(canvas);
  const to = center(target);
  const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 120 };
  const at = (p, s) => `translate(${p.x - 24}px, ${p.y - 24}px) scale(${s})`;
  await star.animate([
    { transform: at(from, 0.4) },
    { transform: at(mid, 1.4), offset: 0.5 },
    { transform: at(to, 0.7) },
  ], { duration: FLY_MS, easing: 'ease-in-out' }).finished.catch(() => {});
  star.remove();
}

function bump(el, text) {
  el.textContent = text;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

// me: de Toad-sessie waarvoor dit uitdelen loopt; stopt als die voorbij is
async function award(me, card, player, prize) {
  const starsEl = card.querySelector('.stars');
  const pointsEl = card.querySelector('.points');
  for (let i = 1; i <= prize.stars; i++) {
    await flyStar(starsEl);
    if (toad !== me) return;
    bump(starsEl, `⭐ ${player.stars + i}`);
  }
  bump(pointsEl, `🍄 ${player.points + prize.points}`);
}

// ranking: van winnaar naar laatste; players: in kaartvolgorde
export async function startToad(ranking, players) {
  stopToad();
  const me = { sprite: createSprite('toad', 'point'), time: performance.now() / 1000, raf: 0 };
  toad = me;
  me.raf = requestAnimationFrame(frame);
  bubble.innerHTML = '';
  const losers = ranking.slice(2).map((p) => p.character.name).join(' en ');
  [
    `Goed gedaan, ${ranking[0].character.name}!`,
    awardLine(ranking[0], AWARDS.first),
    awardLine(ranking[1], AWARDS.second),
    `${losers} gaan een trede omlaag.`,
  ].forEach((text) => {
    const line = document.createElement('p');
    line.textContent = text;
    bubble.appendChild(line);
  });
  const cards = renderHud(cardsBox, players);
  const cardOf = (p) => cards[players.indexOf(p)];
  await wait(900);
  if (toad !== me) return;
  play(me.sprite, 'clap');
  await award(me, cardOf(ranking[0]), ranking[0], AWARDS.first);
  if (toad !== me) return;
  await award(me, cardOf(ranking[1]), ranking[1], AWARDS.second);
}

export function stopToad() {
  if (!toad) return;
  cancelAnimationFrame(toad.raf);
  toad = null;
}
