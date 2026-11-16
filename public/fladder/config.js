// Fladder over Gouda: alle getallen om het spel makkelijker of moeilijker te maken.
// Afstanden in logische pixels (het speelveld is 540 hoog), tijd in seconden.

export const PHYS = {
  gravity: 1400, // hoe hard het musje valt (hoger = sneller naar beneden)
  flap: -400, // kracht van één fladder (meer min = hoger)
  maxFall: 620, // hoogste valsnelheid
  radius: 15, // grootte van het musje voor botsen
};

export const TOWER = {
  width: 84, // breedte van een kaastoren
  spacing: 270, // afstand tussen twee torens
  firstGap: 210, // opening van de eerste torens
  easyTowers: 3, // zoveel torens houden de grote opening
  shrink: 3, // daarna per toren zoveel kleiner
  minGap: 150, // kleinste opening
  maxShift: 140, // hoeveel de opening per toren hoger of lager mag liggen
  margin: 70, // ruimte boven de hoogste opening
};

export const SPEED = {
  start: 170, // snelheid aan het begin
  perPoint: 3, // per punt zoveel sneller
  max: 250, // hoogste snelheid
};

export const GROUND = 64; // hoogte van de straat onderaan
export const FIELD = { height: 540, minWidth: 400, maxWidth: 1100, maxHeight: 820 };
export const PHASE_EVERY = 10; // na zoveel punten verandert de lucht

// Liggend: 540 hoog en zo breed als het scherm. Staand: 400 breed en hoger.
export function fieldSize(width, height) {
  const aspect = width > 0 && height > 0 ? width / height : 16 / 9;
  if (aspect >= FIELD.minWidth / FIELD.height) {
    return { w: Math.round(Math.min(FIELD.maxWidth, FIELD.height * aspect)), h: FIELD.height };
  }
  return { w: FIELD.minWidth, h: Math.round(Math.min(FIELD.maxHeight, FIELD.minWidth / aspect)) };
}

// Grootte van het musje (1 = gewone maat). Groter is makkelijker te zien, kleiner past beter.
export const SIZE = {
  start: 1.3, // zo groot begint het musje
  steps: [[10, 1], [20, 0.85]], // vanaf zoveel punten → zo groot
  tunnel: 0.75, // in de opening van een kaastoren wordt het musje zo klein
  reach: 50, // zoveel pixels vóór en na een toren begint of stopt het krimpen
  rate: 8, // hoe snel het krimpt en groeit
};
