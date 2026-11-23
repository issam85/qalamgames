// Het uiterlijk per wereld: blokken, randen en de achtergrond.
import { stoneTexture, zelligeTexture, marbleTexture, sandstoneTexture } from './textures-blocks.js';

export const STYLES = {
  // Lantaarnstad: stenen huizen met kleine koepels
  stad: {
    block: stoneTexture, tint: '#ffffff', edge: '#ffd43b',
    city: { dark: '#150c3a', dome: '#150c3a', window: '#ffcf6b', domeEvery: 3, towerEvery: 5 },
    extras: null,
  },
  // Sterrenbazaar: mozaïek, en vóór de huizen marktkraampjes met lichtsnoeren
  bazaar: {
    block: zelligeTexture, tint: '#ffffff', edge: '#5cf2d6',
    city: { dark: '#1a0d33', dome: '#1a0d33', window: '#ffb36b', domeEvery: 4, towerEvery: 6 },
    extras: 'market',
  },
  // Hemelpaleis: marmer met goud, gouden koepels en torens, wolken
  paleis: {
    block: marbleTexture, tint: '#ffffff', edge: '#ffd43b',
    city: { dark: '#2a2070', dome: '#e0b100', window: '#fff1b8', domeEvery: 1, towerEvery: 2 },
    extras: 'clouds',
  },
  // Woestijnoase: zandsteen, lage lemen huizen, duinen, palmen, kamelen en water
  oase: {
    block: sandstoneTexture, tint: '#ffffff', edge: '#ffb84d',
    city: { dark: '#2b1640', dome: '#2b1640', window: '#ffb347', domeEvery: 2, towerEvery: 7 },
    extras: 'desert',
  },
};

export const styleOf = (level) => STYLES[level.style] || STYLES.stad;
