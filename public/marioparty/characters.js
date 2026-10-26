// Pixel-sprites voor de 7 karakters. Elke letter in een shape verwijst naar
// een kleur in de palette van dat karakter; '.' is transparant.
export const SPRITE_W = 8;
export const SPRITE_H = 12;

const SHAPES = {
  plumber: [
    '..HHHHH.',
    '.HHHHHHH',
    '.SSSSSS.',
    'SSMSSMSS',
    '.SSSSSS.',
    '.SMMMMS.',
    '..CCCC..',
    '.CCOOCC.',
    'SOOOOOOS',
    '.OOOOOO.',
    '.OO..OO.',
    'BBB..BBB',
  ],
  princess: [
    '...YY...',
    '..YHHY..',
    '.HHHHHH.',
    '.HSSSSH.',
    'HSMSSMSH',
    'HHSSSSHH',
    'HH.DD.HH',
    '..DDDD..',
    '.DDDDDD.',
    '.DDDDDD.',
    'DDDDDDDD',
    'DDDDDDDD',
  ],
  toad: [
    '..WWWW..',
    '.WRWWRW.',
    'WRRWWRRW',
    'WWWWWWWW',
    '.SSSSSS.',
    '.SMSSMS.',
    '..SSSS..',
    '..VVVV..',
    '.SVVVVS.',
    '..WWWW..',
    '..WW.WW.',
    '..BB.BB.',
  ],
  yoshi: [
    '..GGGG..',
    '.GWMGWM.',
    'GGGGGGGG',
    '.GGGGGGG',
    '.GGGGGG.',
    '..GGG...',
    '.GGGRRG.',
    'GGGGRRGG',
    '.GGGGGGG',
    '.GGGGG..',
    '.GG.GG..',
    '.OO.OO..',
  ],
  bowser: [
    '.RR..RR.',
    '..YYYY..',
    '.YMYYMY.',
    '.YYYYYY.',
    '.YYWWYY.',
    'GWGGGGWG',
    '.GGGGGG.',
    'GYYYYYYG',
    '.YYYYYY.',
    '.YYYYYY.',
    '.YY..YY.',
    '.YY..YY.',
  ],
};

const SKIN = '#ffcc99';
const DARK = '#3b2a1a';
const SHOE = '#6b3e1a';

export const CHARACTERS = [
  { key: 'mario', name: 'Mario', color: '#e52521', shape: 'plumber',
    palette: { H: '#e52521', S: SKIN, M: DARK, C: '#e52521', O: '#1f5fd6', B: SHOE } },
  { key: 'luigi', name: 'Luigi', color: '#2faf4e', shape: 'plumber',
    palette: { H: '#2faf4e', S: SKIN, M: DARK, C: '#2faf4e', O: '#1f3f9f', B: SHOE } },
  { key: 'peach', name: 'Peach', color: '#ff8ac8', shape: 'princess',
    palette: { Y: '#f7d03c', H: '#f9e27a', S: SKIN, M: '#2d5fd6', D: '#ff8ac8' } },
  { key: 'daisy', name: 'Daisy', color: '#ff9f1c', shape: 'princess',
    palette: { Y: '#f7d03c', H: '#a0522d', S: SKIN, M: '#2d5fd6', D: '#ff9f1c' } },
  { key: 'toad', name: 'Toad', color: '#ffffff', shape: 'toad',
    palette: { W: '#ffffff', R: '#e52521', S: SKIN, M: DARK, V: '#2659c7', B: SHOE } },
  { key: 'yoshi', name: 'Yoshi', color: '#4cc24a', shape: 'yoshi',
    palette: { G: '#4cc24a', W: '#ffffff', M: DARK, R: '#e52521', O: '#f08c1e' } },
  { key: 'bowser', name: 'Bowser', color: '#f7d03c', shape: 'bowser',
    palette: { R: '#e52521', Y: '#f7d03c', G: '#2e8b3b', W: '#ffffff', M: DARK } },
];

export function drawCharacter(ctx, character, x, y, scale) {
  SHAPES[character.shape].forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      if (ch === '.') return;
      ctx.fillStyle = character.palette[ch];
      ctx.fillRect(x + rx * scale, y + ry * scale, scale, scale);
    });
  });
}

export function characterCanvas(character, scale) {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_W * scale;
  canvas.height = SPRITE_H * scale;
  drawCharacter(canvas.getContext('2d'), character, 0, 0, scale);
  return canvas;
}
