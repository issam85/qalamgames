// Kleuren van de lantaarn: kant-en-klare combinaties en losse kleuren. Keuze wordt bewaard.
import { readSave, patchSave } from './storage.js';

export const COMBOS = [
  { name: 'Goud', body: '#ffc93c', metal: '#b5651d' },
  { name: 'Maanlicht', body: '#dff3ff', metal: '#5b6b8c' },
  { name: 'Munt', body: '#5cf2d6', metal: '#0f7c6c' },
  { name: 'Roos', body: '#ff8fb8', metal: '#a0225e' },
  { name: 'Vuur', body: '#ff7a33', metal: '#6e1f12' },
  { name: 'Paars', body: '#c08cff', metal: '#4a2a9c' },
  { name: 'Hemel', body: '#7fd3ff', metal: '#1565c0' },
  { name: 'Limoen', body: '#c6f24a', metal: '#3d7a1d' },
  { name: 'Koningin', body: '#ffd43b', metal: '#7b1fa2' },
  { name: 'Nachtlicht', body: '#38e8d8', metal: '#1b1034' },
];

export const BODY_COLORS = [
  '#ffc93c', '#ffd43b', '#ff7a33', '#ff5d5d', '#ff8fb8', '#c08cff',
  '#7fd3ff', '#38e8d8', '#5cf2d6', '#c6f24a', '#dff3ff',
];

export const METAL_COLORS = [
  '#b5651d', '#6e1f12', '#c62828', '#a0225e', '#7b1fa2', '#4a2a9c',
  '#1565c0', '#0f7c6c', '#3d7a1d', '#5b6b8c', '#1b1034',
];

export function loadSkin() {
  const { skin } = readSave();
  if (BODY_COLORS.includes(skin?.body) && METAL_COLORS.includes(skin?.metal)) return skin;
  return { body: COMBOS[0].body, metal: COMBOS[0].metal };
}

export const saveSkin = (skin) => patchSave({ skin });
