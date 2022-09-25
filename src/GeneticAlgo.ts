import { Deno } from "./Deno.js";
import { settings } from "./settings.js";

export class GeneticAlgo {
  denos: Deno[] = []
  deads = 0
  
  constructor() {
  }

  //Function for the next generation
  nextGen() {
    console.log("Adding generation...");

    let newPopulation: Deno[] = [];

    this.calculateFitness();

    for (let i = 0; i < settings.populationLength; i++) {
      newPopulation.push(this.reproduce());
    }

    this.denos = newPopulation;
    // TODO: reset game

    this.deads = 0;
  }

  reproduce() {
    let brainA = this.pickOne();
    let brainB = this.pickOne();
    let childBrain = brainA.crossover(brainB);

    childBrain.mutate(settings.mutation);

    return new Deno(childBrain);
  }

  pickOne() {
    let index = 0;
    let r = Math.random();

    while (r > 0) {
      r = r - this.denos[index].fitness;
      index++;
    }

    index--;

    return this.denos[index].brain;
  }

  // Normalize all fitness values
  calculateFitness() {
    let sum = 0;

    for (let deno of this.denos) {
      sum += deno.score;
    }

    for (let deno of this.denos) {
      deno.fitness = deno.score / sum;
    }
  }
}
