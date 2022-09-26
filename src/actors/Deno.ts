// @ts-ignore
import ml5 from "ml5";
import { Brain, BrainInputs } from "../brain";
import DinoGame from "../game/DinoGame";
import { settings } from "../settings";
import Actor from "./Actor";
import { pipe, sortBy, prop, last } from "ramda";

interface DenoOptions {
  imageData: ImageData;
  game: DinoGame;
  brain?: Brain;
}

export default class Deno extends Actor {
  brain: Brain;
  game: DinoGame;
  isDucking = false;
  legFrames = 0;
  legShowing = "Left";
  vVelocity = 0;
  baseY = 0;
  relativeY = 0;
  legsRate = 0;
  lift = 0;
  gravity = 0;
<<<<<<< HEAD
  brain: any;
  alive = true
  fitness = 0
  score = 0;
=======
  alive = true;
  score = 0;
  fitness = 0;
>>>>>>> 60fb402d4c5ea51a237de5d7eb2f93b6c8b59147

  constructor(options: DenoOptions) {
    super(options.imageData);
    this.game = options.game;
    this.setSprite(`dino${this.legShowing}Leg`);

    if (options.brain) {
      this.brain = options.brain;
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
    this.alive = true;
    this.fitness = 0;
    this.score = 0;
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
      this.vVelocity += this.gravity;
      this.relativeY += this.vVelocity;
    }

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

  think(options: BrainInputs) {
    const inputs = [
      options.cactus.distance / this.game.width,
      options.cactus.height / this.game.height,
      options.cactus.speed / 50,
      // options.bird.distance,
      // options.bird.height,
      // options.speed,
    ];

    const outputs = this.brain.classifySync(inputs);
    const result = pipe(
      sortBy(prop("confidence")),
      last,
      prop("label")
    )(outputs);

    if (result === "jump") {
      return this.jump();
    }

    if (result === "duck") {
      return this.duck(true);
    }

    if (result === "walk") {
      if (this.isDucking) {
        this.duck(false);
      }
    }

    return;
  }

  run() {
    const cactus = this.game.state.cacti[0];

    if (!cactus) return;

    const cactusX = cactus.x;
    const cactusDistance = cactusX - this.x;

    this.think({
      cactus: {
        distance: cactusDistance,
        height: cactus.height,
        speed: cactus.speed,
      },
    });

    if (this.hits([this.game.state.cacti[0], this.game.state.birds[0]])) {
      this.alive = false;
    }
  }
}
