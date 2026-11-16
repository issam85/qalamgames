// Alle getallen van het spel op één plek. Meters, seconden, meters per seconde.

export const STEP = 1 / 120; // vaste tijdstap van de natuurkunde

// De kooi: x = lengte (doelen op -x en +x), z = breedte, y = omhoog.
export const FIELD = {
  halfL: 15,
  halfW: 9,
  ceiling: 7, // het net boven de kooi
};

export const GOAL = {
  halfW: 2, // halve breedte van de doelmond
  height: 2.1,
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
  noTouch: 0.3, // na een trap even niet aannemen
};

export const SHOT = {
  charge: 0.8, // seconden tot volle kracht
  min: 11,
  max: 27,
  lift: 2.2, // omhoog bij een zacht schot
  liftMax: 5.5,
  volley: 1.05, // een losse bal raak je tot hier
  assist: 0.55, // deel van de hoek naar het doel dat wordt bijgestuurd
  assistCone: 0.7, // alleen als je al zo ongeveer naar het doel kijkt (radialen)
};
