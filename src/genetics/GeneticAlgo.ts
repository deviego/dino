import { makeAutoObservable } from "mobx";
import Deno from "../actors/Deno";
import DinoGame from "../game/DinoGame";
import { settings } from "../settings";

export class GeneticAlgo {
  generation = 0;

  constructor(private game: DinoGame) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get deads() {
    return this.game.state.dinos.filter((dino) => !dino.alive).length;
  }

  setup() {
    for (let i = 0; i < settings.populationLength; i++) {
      const dino = new Deno({
        imageData: this.game.spriteImageData!,
        game: this.game,
      });
      const settings = this.game.state.settings;

      dino.legsRate = settings.dinoLegsRate;
      dino.lift = settings.dinoLift;
      dino.gravity = settings.dinoGravity;
      dino.x = 25;
      dino.baseY = this.game.height - settings.dinoGroundOffset;

      this.game.state.dinos.push(dino);
    }

    this.game.start().catch(console.error);
    this.game.resetGame();
    this.game.onEndGame = () => {
      this.nextGen();
      this.game.resetGame();
    };
  }

  nextGen() {
    console.log("Adding generation...");

    let newPopulation: Deno[] = [];

    this.calculateFitness();

    for (let i = 0; i < settings.populationLength; i++) {
      const currentDino = this.game.state.dinos[i];

      if (currentDino.score > this.game.bestScore) {
        this.game.setBestScore(currentDino.score);
      }

      newPopulation.push(this.reproduce());
    }

    this.game.state.dinos = newPopulation;
    this.generation++;
  }

  reproduce() {
    let brainA = this.pickOne();
    let brainB = this.pickOne();
    let childBrain = brainA.crossover(brainB);

    childBrain.mutate(settings.mutation);

    const child = new Deno({
      imageData: this.game.spriteImageData!,
      game: this.game,
      brain: childBrain,
    });
    const gameSettings = this.game.state.settings;

    child.legsRate = gameSettings.dinoLegsRate;
    child.lift = gameSettings.dinoLift;
    child.gravity = gameSettings.dinoGravity;
    child.x = 25;
    child.baseY = this.game.height - gameSettings.dinoGroundOffset;

    return child;
  }

  pickOne() {
    let index = 0;
    let r = Math.random();

    while (r > 0) {
      r = r - this.game.state.dinos[index].fitness;
      index++;
    }

    index--;

    return this.game.state.dinos[index].brain;
  }

  calculateFitness() {
    let sum = 0;

    for (let deno of this.game.state.dinos) {
      sum += deno.score;
    }

    for (let deno of this.game.state.dinos) {
      deno.fitness = deno.score / sum;
    }
  }
}
