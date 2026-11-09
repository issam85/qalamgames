// Een kind in vooraanzicht, getekend met de voeten op (0, 0) en ongeveer 112 hoog.
const SOOT = '#3d3a38';

function limb(c, x1, y1, x2, y2, color, width) {
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
}

function dot(c, x, y, r, color) {
  c.fillStyle = color;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}

function drawLegs(c, seated) {
  if (seated) {
    limb(c, -24, -8, 24, -4, '#37474f', 13);
    limb(c, 24, -8, -24, -4, '#455a64', 13);
    return;
  }
  limb(c, -9, -30, -10, -7, '#37474f', 12);
  limb(c, 9, -30, 10, -7, '#37474f', 12);
  limb(c, -13, -3, -8, -3, '#fafafa', 9);
  limb(c, 8, -3, 13, -3, '#fafafa', 9);
}

function drawArms(c, arms, shirt, skin) {
  const ends = {
    down: [[-23, -32], [23, -32]],
    hold: [[-8, -38], [8, -38]],
    up: [[-30, -88], [30, -88]],
    throw: [[-23, -32], [34, -62]],
  }[arms];
  ends.forEach(([x, y], i) => {
    const sx = i ? 17 : -17;
    limb(c, sx, -56, x, y, shirt, 10);
    dot(c, x, y, 6.5, skin);
  });
}

function drawHairBack(c, kid, skin) {
  if (kid.hair !== 'hijab') return;
  c.fillStyle = kid.hairColor;
  c.beginPath();
  c.arc(0, -84, 31, Math.PI, 0);
  c.quadraticCurveTo(32, -50, 22, -44);
  c.lineTo(-22, -44);
  c.quadraticCurveTo(-32, -50, -31, -84);
  c.fill();
  dot(c, 0, -82, 21, skin);
}

function drawHairTop(c, kid) {
  c.fillStyle = kid.hairColor;
  if (kid.hair === 'short' || kid.hair === 'cap') {
    c.beginPath();
    c.arc(0, -86, 27, Math.PI, 0);
    c.quadraticCurveTo(0, -100, -27, -86);
    c.fill();
  }
  if (kid.hair === 'cap') {
    c.beginPath();
    c.ellipse(12, -94, 26, 7, 0.08, 0, Math.PI * 2);
    c.fill();
  }
  if (kid.hair === 'curly') {
    for (let i = -3; i <= 3; i++) dot(c, i * 8, -104 + Math.abs(i) * 4 + (i % 2) * 2, 9, kid.hairColor);
  }
}

function drawFace(c, mood, look) {
  const scared = mood === 'scared' || mood === 'soot';
  [-9, 9].forEach((x) => {
    dot(c, x, -85, scared ? 7 : 5.5, '#fff');
    if (mood !== 'soot') dot(c, x + look[0] * 2.4, -85 + look[1] * 2.4, 3.2, '#22160f');
  });
  c.strokeStyle = '#22160f';
  c.lineWidth = 2.6;
  c.lineCap = 'round';
  if (scared) {
    dot(c, 0, -71, 6, mood === 'soot' ? '#111' : '#5d2018');
    limb(c, -15, -96, -5, -99, '#22160f', 2.6);
    limb(c, 15, -96, 5, -99, '#22160f', 2.6);
  } else {
    c.beginPath();
    c.arc(0, -76, 8, 0.25, Math.PI - 0.25);
    c.stroke();
  }
}

// o: mood (happy/scared/soot), arms (down/hold/up/throw), look [x, y], seated.
export function drawKid(c, kid, x, y, s, o = {}) {
  const { mood = 'happy', arms = 'down', look = [0, 0], seated = false } = o;
  const soot = mood === 'soot';
  const skin = soot ? SOOT : kid.skin;
  const shirt = soot ? '#5a5552' : kid.shirt;
  c.save();
  c.translate(x, y);
  c.scale(s, s);
  c.fillStyle = 'rgba(0,0,0,.22)';
  c.beginPath();
  c.ellipse(0, 0, seated ? 34 : 26, 8, 0, 0, Math.PI * 2);
  c.fill();
  drawLegs(c, seated);
  if (seated) c.translate(0, 20);
  c.fillStyle = shirt;
  c.beginPath();
  c.roundRect(-20, -62, 40, 38, 12);
  c.fill();
  drawArms(c, arms, shirt, skin);
  drawHairBack(c, kid, skin);
  if (kid.hair !== 'hijab') dot(c, 0, -84, 26, skin);
  drawHairTop(c, soot ? { ...kid, hairColor: '#2a2725' } : kid);
  drawFace(c, mood, look);
  c.restore();
}

export function drawSweat(c, x, y, t) {
  const d = (t * 2.2) % 1;
  c.fillStyle = `rgba(120,200,255,${1 - d})`;
  c.beginPath();
  c.ellipse(x + 30, y - 100 + d * 26, 4, 6.5, 0, 0, Math.PI * 2);
  c.fill();
}
