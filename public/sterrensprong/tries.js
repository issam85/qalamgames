// Pogingen en checkpoints. Start: geen levens; na een botsing begin je bij het laatste checkpoint
// uit level.lifeCheckpoints (wereld 1 vijf, de andere vier). Oefenen: met de checkpoints vóór
// bijna elk stukje. count = de hoeveelste poging dit is.
export function createTries() {
  let points = [];
  return {
    practice: false,
    reached: -1, // laatst gehaalde checkpoint
    count: 1,
    begin(level, practice) {
      this.practice = practice;
      points = practice ? level.checkpoints : level.lifeCheckpoints;
      this.reached = -1;
      this.count = 1;
    },
    spawn() {
      return this.reached < 0 ? 0 : points[this.reached];
    },
    // true als er net een nieuw checkpoint is gehaald
    pass(x) {
      if (this.reached + 1 >= points.length || x < points[this.reached + 1]) return false;
      this.reached++;
      return true;
    },
    // na een botsing: de volgende poging, vanaf het laatste checkpoint
    respawn() {
      this.count++;
    },
  };
}
