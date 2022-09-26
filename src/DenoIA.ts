import { settings } from "./settings";
import ml5 from 'ml5'
import { GeneticAlgo } from "./genetics/GeneticAlgo";


export class DenoIA {

  
  brain: any 
  alive = false;

  constructor(private environment: GeneticAlgo,brain?: any) {
    if (brain) {
      this.brain = brain;
    } else {
      this.brain = ml5.neuralNetwork(settings.neuralNetworkConfig);
    }
  }


  checkCollision (closestPipe:any) {
    const hasCollided = false
    // Runner
    
    
    if (hasCollided) {        
      this.alive = false
      this.environment.deads++
    }
    else {
      this.move(closestPipe)

    }
  }
  move(_closestPipe: any) {
    throw new Error("Method not implemented.");
  }

  run() {
    this.checkCollision(closestPipe)
  }
}
