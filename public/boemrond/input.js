// Doorgeven: alleen = pijltje naar rechts (of D); samen = D en pijltje naar rechts.
// Op een tablet tik je op je eigen helft.
export const isTouch = () => matchMedia('(hover: none)').matches;

export function keyGlyph(human, humans) {
  if (isTouch()) return 'Tik!';
  return humans === 2 && human === 0 ? 'D' : '→';
}

export function bindInput(stage, getHumans, onPress) {
  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const isD = e.key === 'd' || e.key === 'D';
    const isRight = e.key === 'ArrowRight';
    if (!isD && !isRight) return;
    e.preventDefault();
    if (getHumans() === 1) onPress(0);
    else onPress(isD ? 0 : 1);
  });
  stage.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (getHumans() === 1) {
      onPress(0);
      return;
    }
    const box = stage.getBoundingClientRect();
    onPress(e.clientX - box.left < box.width / 2 ? 0 : 1);
  });
}
