import { settings } from "./settings";
import ml5 from "ml5"

export class Deno {
  brain = null;

  constructor(brain) {
    this.alive = true;
    this.score = 0;
    this.fitness = 0;

    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork(settings.neuralNetworkConfig);
    }
  }
}
