import sprites from "../sprites";
import Actor from "./Actor";

export default class Bird extends Actor {
  static maxBirdHeight = Math.max(sprites.birdUp.h, sprites.birdDown.h) / 2;
  static wingSpriteYShift = 6;
  wingFrames: number;
  wingDirection: string;
  speed: number;
  wingsRate: number;

  constructor(imageData: ImageData) {
    super(imageData);
    this.wingFrames = 0;
    this.wingDirection = "Up";
    this.setSprite(`bird${this.wingDirection}`);
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.wingsRate = 0;
  }

  nextFrame() {
    this.x -= this.speed;
    this.determineSprite();
  }

  determineSprite() {
    const oldHeight = this.height;

    if (this.wingFrames >= this.wingsRate) {
      this.wingDirection = this.wingDirection === "Up" ? "Down" : "Up";
      this.wingFrames = 0;
    }

    this.setSprite(`bird${this.wingDirection}`);
    this.wingFrames++;

    if (this.height !== oldHeight) {
      let adjustment = Bird.wingSpriteYShift;
      if (this.wingDirection === "Up") {
        adjustment *= -1;
      }

      this.y += adjustment;
    }
  }
}
