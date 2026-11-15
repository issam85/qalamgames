// Trage computer (Chromebook)? Na 2 seconden meten: duurt een beeld gemiddeld meer dan 20 ms,
// dan tekenen we op 1 pixel per pixel. Eén keer, daarna blijft het zo.
const MEASURE = 2000; // ms
const SLOW = 20; // ms per beeld

export function createQuality(renderer, resize) {
  let start = 0;
  let frames = 0;
  let last = 0;
  let done = false;
  return function tick() {
    if (done) return;
    const now = performance.now();
    if (now - last > 250) [start, frames] = [now, 0]; // tabblad was weg: opnieuw meten
    last = now;
    frames++;
    if (now - start < MEASURE) return;
    done = true;
    if ((now - start) / frames > SLOW && renderer.getPixelRatio() > 1) {
      renderer.setPixelRatio(1);
      resize();
    }
  };
}
