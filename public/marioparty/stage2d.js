// Gedeeld door de 2D-minigames: het canvas tekent in een vaste logische maat van
// 960×540 en wordt geschaald naar de echte resolutie; plus de statustekst (aftellen,
// Finish!) met pop-animatie en een label met donkere rand.
export const W = 960;
export const H = 540;

export function setupStage(canvas) {
  const ctx = canvas.getContext('2d');
  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
  };
  resize();
  window.addEventListener('resize', resize);
  return {
    ctx,
    // aan het begin van elk frame: schaal naar 960×540 en maak leeg
    begin() {
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
      ctx.clearRect(0, 0, W, H);
    },
    dispose() {
      window.removeEventListener('resize', resize);
    },
  };
}

export function statusSetter(el) {
  el.textContent = '';
  return (text) => {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  };
}

export function drawLabel(ctx, text, x, y, size, color = '#fff', align = 'center') {
  ctx.font = `700 ${size}px Fredoka, sans-serif`;
  ctx.textAlign = align;
  ctx.lineWidth = size / 3.5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.strokeText(text, x, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
