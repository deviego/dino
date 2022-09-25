import "./styles/style.css";
import DinoGame from "./game/DinoGame";
import { GeneticAlgo } from "./genetics/GeneticAlgo";
import { autorun } from "mobx";

const game = new DinoGame(600, 150);
const environment = new GeneticAlgo(game);

environment.setup();

autorun(() => {
  document.querySelector(
    "#best-score"
  )!.innerHTML = `Best Score:  ${game.bestScore}`;

  document.querySelector(
    "#generation"
  )!.innerHTML = `Generation:  ${environment.generation}`;
});
