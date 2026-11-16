// Stand bovenin, uithouding en schietkracht onderin, en "GOAL!" na een doelpunt.
const $ = (id) => document.getElementById(id);

let shownScore = '';

export function updateHud(match) {
  const score = match.score.join(' – ');
  if (score !== shownScore) {
    $('score').textContent = score;
    shownScore = score;
  }
  const me = match.players[0];
  $('stamina-fill').style.width = `${Math.round(me.stamina * 100)}%`;
  $('stamina').classList.toggle('tired', me.tired);
  $('charge').classList.toggle('on', me.charging);
  $('charge-fill').style.width = `${Math.round(me.charge * 100)}%`;
}

export function showGoal(team) {
  const el = $('goal');
  el.textContent = team === 0 ? 'GOAL!' : 'Tegengoal…';
  el.classList.remove('show');
  void el.offsetWidth; // animatie opnieuw starten
  el.classList.add('show');
}

let toastTimer = 0;

// korte melding midden in beeld, bv. "Gered!"
export function showToast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 900);
}
