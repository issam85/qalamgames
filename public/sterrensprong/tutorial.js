// De eerste keer een handje: vóór de eerste punt, de eerste ring, de eerste tunnel en de eerste
// poort (vliegen en ondersteboven). Per soort één keer; pas bewaard als je er voorbij bent.
import { readSave, patchSave } from './storage.js';
import { showHint } from './hint.js';

const first = (list, test) => list.find(test);

// per soort: wat het is, vanaf hoeveel seconden ervoor het handje komt, en welk handje
function targets(level) {
  const obs = level.obstacles;
  const list = [];
  const add = (kind, item, lead, hand, text, after = 0) => {
    if (item) list.push({ kind, from: item.x - lead, to: item.x + (item.w || 0) + after, hand, text });
  };
  const speedAt = (x) => level.zones.filter((z) => z.x <= x).pop().speed;
  const spike = first(obs, (o) => o.type === 'spike');
  const ring = first(obs, (o) => o.type === 'ring');
  const tunnel = first(obs, (o) => o.type === 'block' && o.y > 1);
  const fly = first(level.portals, (p) => p.mode === 'fly');
  const flip = first(level.portals, (p) => p.mode === 'flip');
  const at = (item, seconds) => (item ? speedAt(item.x) * seconds : 0);
  add('spike', spike, at(spike, 0.7), 'tap', 'Tik!');
  add('ring', ring, at(ring, 0.6), 'tap', 'Tik in de ring');
  add('tunnel', tunnel, at(tunnel, 0.8), 'no', 'Niet tikken');
  add('fly', fly, at(fly, 0.5), 'hold', 'Vasthouden = omhoog', at(fly, 1.5));
  add('flip', flip, at(flip, 0.5), 'down', 'Tik = naar beneden', at(flip, 1.5));
  return list;
}

export function createTutorial() {
  const seen = { ...(readSave().seen || {}) };
  let list = [];
  return {
    load(level) {
      list = targets(level);
    },
    // run = null als er niet gespeeld wordt
    update(run) {
      let current = null;
      list.forEach((t) => {
        if (!run || seen[t.kind]) return;
        if (run.x >= t.to) {
          seen[t.kind] = true;
          patchSave({ seen: { ...(readSave().seen || {}), [t.kind]: true } });
        } else if (run.x >= t.from && !current) current = t;
      });
      showHint(current?.hand || null, current?.text);
    },
  };
}
