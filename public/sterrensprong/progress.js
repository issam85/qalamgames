// Welke werelden open zijn en het beste percentage per wereld.
import { readSave, patchSave } from './storage.js';

export function loadProgress(worldCount) {
  const { unlocked, best } = readSave();
  return {
    unlocked: Number.isInteger(unlocked) ? Math.min(worldCount, Math.max(1, unlocked)) : 1,
    best: best && typeof best === 'object' ? best : {},
  };
}

function store(progress) {
  patchSave({ unlocked: progress.unlocked, best: progress.best });
}

export const bestOf = (progress, level) => Number(progress.best[level.name]) || 0;

// geeft true terug bij een nieuw record
export function recordPercent(progress, level, percent) {
  if (percent <= bestOf(progress, level)) return false;
  progress.best[level.name] = percent;
  store(progress);
  return true;
}

export function completeWorld(progress, level, index, worldCount) {
  progress.best[level.name] = 100;
  progress.unlocked = Math.min(worldCount, Math.max(progress.unlocked, index + 2));
  store(progress);
}
