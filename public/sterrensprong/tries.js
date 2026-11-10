// Levens en checkpoints. Start: 5 levens en checkpoints op 20, 40, 60 en 80%. Oefenen: onbeperkt.
export const START_LIVES = 5;

export function createTries() {
  let points = [];
  return {
    practice: false,
    reached: -1, // laatst gehaalde checkpoint
    lives: START_LIVES,
    count: 1,
    begin(level, practice) {
      this.practice = practice;
      points = practice ? level.checkpoints : level.lifeCheckpoints;
      this.reached = -1;
      this.lives = START_LIVES;
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
    lose() {
      if (!this.practice) this.lives--;
    },
    // na de botsing; true als de levens op zijn en alles opnieuw begint
    respawn() {
      this.count++;
      if (this.lives > 0) return false;
      this.lives = START_LIVES;
      this.reached = -1;
      return true;
    },
  };
}
