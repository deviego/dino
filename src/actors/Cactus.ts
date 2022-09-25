import { randItem } from '../utils'
import Actor from './Actor'

const VARIANTS = ['cactus', 'cactusDouble', 'cactusDoubleB', 'cactusTriple']

export default class Cactus extends Actor {
  speed = 0
  
  constructor(imageData?: ImageData) {
    super(imageData)
    this.setSprite(randItem(VARIANTS))
  }

  nextFrame() {
    this.x -= this.speed
  }
}