// @ts-ignore
import ml5 from "ml5";
import { settings } from "../settings";
import Actor from "./Actor";

export default class Deno extends Actor {
  isDucking = false;
  legFrames = 0;
  legShowing = "Left";
  vVelocity = 0;
  baseY = 0;
  relativeY = 0;
  legsRate = 0;
  lift = 0;
  gravity = 0;
  brain: any;
  // alive = true
  // score = 0
  // fitness = 0

  constructor(imageData: ImageData, brain?: any) {
    super(imageData);
    this.setSprite(`dino${this.legShowing}Leg`);

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork(settings.neuralNetworkConfig);
    }
  }

  get y() {
    return this.baseY - this.height + this.relativeY;
  }

  set y(value) {
    this.baseY = value;
  }

  reset() {
    this.isDucking = false;
    this.legFrames = 0;
    this.legShowing = "Left";
    this.setSprite(`dino${this.legShowing}Leg`);
    this.vVelocity = 0;
    this.relativeY = 0;
  }

  jump() {
    if (this.relativeY === 0) {
      this.vVelocity = -this.lift;
      return true;
    }
    return false;
  }

  duck(value: boolean) {
    this.isDucking = value;
  }

  nextFrame() {
    if (this.vVelocity !== null) {
      // use gravity to gradually decrease vVelocity
      this.vVelocity += this.gravity;
      this.relativeY += this.vVelocity;
    }

    // stop falling once back down to the ground
    if (this.relativeY > 0) {
      this.vVelocity = 0;
      this.relativeY = 0;
    }

    this.determineSprite();
  }

  determineSprite() {
    if (this.relativeY < 0) {
      // in the air stiff
      this.setSprite("dino");
    } else {
      // on the ground running
      if (this.legFrames >= this.legsRate) {
        this.legShowing = this.legShowing === "Left" ? "Right" : "Left";
        this.legFrames = 0;
      }

      if (this.isDucking) {
        this.setSprite(`dinoDuck${this.legShowing}Leg`);
      } else {
        this.setSprite(`dino${this.legShowing}Leg`);
      }

      this.legFrames++;
    }
  }
}
