// Welke werelden open zijn, het beste percentage en het kleinste aantal pogingen per wereld.
import { readSave, patchSave } from './storage.js';

export function loadProgress(worldCount) {
  const { unlocked, best, attempts } = readSave();
  return {
    unlocked: Number.isInteger(unlocked) ? Math.min(worldCount, Math.max(1, unlocked)) : 1,
    best: best && typeof best === 'object' ? best : {},
    attempts: attempts && typeof attempts === 'object' ? attempts : {},
  };
}

function store(progress) {
  patchSave({ unlocked: progress.unlocked, best: progress.best, attempts: progress.attempts });
}

export const bestOf = (progress, level) => Number(progress.best[level.name]) || 0;
// in hoeveel pogingen gehaald (0 = nog niet)
export const attemptsOf = (progress, level) => Number(progress.attempts[level.name]) || 0;

// geeft true terug bij een nieuw record
export function recordPercent(progress, level, percent) {
  if (percent <= bestOf(progress, level)) return false;
  progress.best[level.name] = percent;
  store(progress);
  return true;
}

export function completeWorld(progress, level, index, worldCount, count) {
  progress.best[level.name] = 100;
  const before = attemptsOf(progress, level);
  if (!before || count < before) progress.attempts[level.name] = count;
  progress.unlocked = Math.min(worldCount, Math.max(progress.unlocked, index + 2));
  store(progress);
}
