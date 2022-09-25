import { randInteger } from '../utils'
import Actor from './Actor'

export default class Cloud extends Actor {
  speed = 0
  speedMod = randInteger(6, 14) / 10
  
  constructor() {
    super()
    this.setSprite('cloud')
  }

  nextFrame() {
    this.x -= this.speed * this.speedMod
  }
}