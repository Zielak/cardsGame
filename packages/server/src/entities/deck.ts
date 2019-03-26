import { Entity } from "../entity"
import { cm2px, limit } from "@cardsgame/utils"
import { Container } from "./container"

export class Deck extends Container {
  type = "deck"
  hijacksInteractionTarget = true

  restyleChild(child: Entity, idx: number, children: Entity[]) {
    const MAX_HEIGHT = cm2px(2.5)
    const MIN_SPACE = cm2px(0.1)
    const SPACE = limit(MAX_HEIGHT / children.length, 0, MIN_SPACE)
    return {
      x: idx * SPACE,
      y: -idx * SPACE,
      angle: 0
    }
  }
}
