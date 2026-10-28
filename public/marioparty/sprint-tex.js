// Hulpjes voor canvas-texturen van de sprint (baan, borden).
import * as THREE from './vendor/three.module.min.js';

// canvas → textuur; repeatX > 1 herhaalt hem horizontaal
export function canvasTexture(canvas, repeatX = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.repeat.x = repeatX;
  return tex;
}

// tekent met draw(ctx, w, h) op een nieuw canvas en geeft de textuur terug
export function drawnTexture(draw, w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  return canvasTexture(c);
}
