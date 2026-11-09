// Make-up uit de badkamer: lippenstift, blush en oogschaduw, elk met een paar kleuren.
// Wat je opdoet blijft zitten in het huis, de kast en bij de kapper.
export const MAKEUP = {
  lips: [['#e0245e', 'rood'], ['#ff5fa2', 'roze'], ['#b03060', 'framboos'], ['#ff7a59', 'koraal'], ['#c98078', 'zacht']],
  blush: [['#ff8fab', 'roze'], ['#ffa07a', 'perzik'], ['#e57399', 'framboos'], ['#f4a6c0', 'zacht'], ['#d98880', 'brons']],
  eyes: [['#b36bff', 'paars'], ['#5ec8ff', 'blauw'], ['#4cd4a0', 'mint'], ['#ffd43b', 'goud'], ['#ff8ac8', 'roze']],
};

// '' = niets op
export const freshMakeup = () => ({ lips: '', blush: '', eyes: '' });

export function validMakeup(makeup) {
  return Boolean(makeup) && Object.keys(MAKEUP).every((kind) => makeup[kind] === ''
    || MAKEUP[kind].some(([hex]) => hex === makeup[kind]));
}
