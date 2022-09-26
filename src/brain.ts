export interface Brain {
  crossover(brain: Brain): Brain;
  mutate(rate: number): void;
  classifySync(input: number[]): string;
  save(outName: string): void;
}

export interface BrainInputs {
  
  cactus: {
    distance: number;
    height: number;
    speed: number;
  };
  // bird: {
  //   distance: number;
  //   height: number;
  //   speed: number
  // };
}
