// Spelconstanten. Afstanden in blokken (1 blok = 1 eenheid), tijd in seconden.
export const PHYS = {
  speed: 9.5,
  gravity: 62,
  jump: 17,
  half: 0.42, // halve breedte van de speler (hoogte is 2 × half)
  step: 1 / 240, // vaste rekenstap, op elke computer dezelfde sprong
  buffer: 0.09, // zo lang telt een druk vóór de landing nog mee
  landTolerance: 0.25, // net onder de bovenkant van een blok telt nog als landen
};

// botsvak van een punt: smaller dan het plaatje, zodat een bijna-raak eerlijk voelt
export const SPIKE_HIT = { inset: 0.28, height: 0.72 };

export const DEATH_PAUSE = 0.75;
