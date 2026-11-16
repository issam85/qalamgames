// Alle getallen van het spel op één plek. Meters, seconden, meters per seconde.

export const STEP = 1 / 120; // vaste tijdstap van de natuurkunde

// De kooi: x = lengte (doelen op -x en +x), z = breedte, y = omhoog.
export const FIELD = {
  halfL: 15,
  halfW: 9,
  ceiling: 7, // het net boven de kooi
};

export const GOAL = {
  halfW: 2.5, // halve breedte van de doelmond
  height: 2.2,
  depth: 1.3,
  post: 0.07, // dikte van paal en lat (straal)
};

export const BALL = {
  radius: 0.22,
  gravity: 20,
  airDrag: 0.12, // per seconde
  roll: 1.1, // afremmen over de grond, per seconde
  bounce: 0.55, // stuiteren op de vloer
  wall: 0.72, // terugkaatsen tegen muur en plafond
  post: 0.62,
  net: 0.1, // het net vangt de bal op
  netHold: 0.3,
  substeps: 2,
};

export const PLAYER = {
  radius: 0.4,
  run: 6,
  sprint: 8.6,
  accel: 32,
  brake: 26,
  turn: 13, // radialen per seconde
  drain: 0.32, // uithouding per seconde sprinten
  regain: 0.22,
  rested: 0.3, // na leeg pas weer sprinten vanaf hier
};

export const CONTROL = {
  reach: 0.8, // afstand waarop je de bal aanneemt
  height: 0.7,
  hold: 0.58, // bal voor je voeten tijdens het dribbelen
  pull: 18, // hoe snel de bal naar je voeten komt
  maxTrap: 17, // hardere ballen neem je niet aan
  softSpeed: 10,
  softHeight: 1,
  noTouch: 0.3, // na een trap even niet aannemen
};

export const SHOT = {
  charge: 0.8, // seconden tot volle kracht
  min: 11,
  max: 27,
  lift: 2.2, // omhoog bij een zacht schot
  liftMax: 5.5,
  volley: 1.05, // een losse bal raak je tot hier
  assist: 0.6, // deel van de hoek naar binnen de palen dat wordt bijgestuurd
  assistCone: 0.35, // alleen als het schot net naast zou gaan (radialen)
  inside: 0.35, // zo ver binnen de paal mikt de hulp
};

export const PASS = {
  cone: 0.95, // teamgenoten binnen deze hoek van je kijkrichting (radialen)
  min: 9,
  max: 19,
  perMeter: 0.9,
  lift: 0.6,
  blind: 14, // pass zonder teamgenoot in die richting
};

export const LOB = {
  up: 9.5, // snelheid omhoog (hoog genoeg om over de keeper te gaan)
  min: 6,
  max: 16,
  blind: 11, // zo ver zonder teamgenoot (meter)
};

export const TACKLE = {
  time: 0.3, // zo lang duurt de uitval
  speed: 9.5,
  reach: 1,
  poke: 6, // de bal schiet zo hard los
  stumble: 0.55, // mis = even struikelen
  cool: 0.8,
};

// de CPU-keeper per moeilijkheid: reactietijd, duiksnelheid, vangen tot, foutje in het inschatten
export const KEEPER = {
  radius: 0.35,
  walk: 4.5,
  rush: 5.5,
  out: 0.6, // zo ver voor de doellijn
  outMax: 1.1,
  hold: 1, // seconden met de bal in de handen
  windup: 0.1, // aanloop van een duik
  diveTime: 0.55,
  down: 0.5,
  reach: 0.28, // armen tot de bal, staand
  diveReach: 0.75, // vanaf het midden tot de handen, liggend
  box: 4, // strafschopgebied: zo diep
  levels: {
    easy: { react: 0.34, step: 2.5, dive: 5.5, catch: 13, error: 0.8 },
    normal: { react: 0.26, step: 3.2, dive: 6.5, catch: 16, error: 0.55 },
    hard: { react: 0.18, step: 4, dive: 7.8, catch: 20, error: 0.3 },
  },
};

// de CPU-spelers per moeilijkheid: denktijd, snelheid, mikfout, tackles per seconde dichtbij, schietafstand
export const CPU = {
  roles: ['achter', 'links', 'rechts'],
  levels: {
    easy: { think: 0.2, speed: 0.82, aimError: 0.22, tackle: 0.5, shootRange: 9, sprint: 0.5 },
    normal: { think: 0.13, speed: 0.92, aimError: 0.13, tackle: 0.9, shootRange: 11, sprint: 0.7 },
    hard: { think: 0.08, speed: 1, aimError: 0.07, tackle: 1.4, shootRange: 12.5, sprint: 0.9 },
  },
  pressRange: 1.4, // vanaf hier tackelen
  lane: 1.1, // een pass is vrij als niemand zo dicht bij de lijn staat
  call: 1.2, // seconden dat "om de bal roepen" geldt
};
