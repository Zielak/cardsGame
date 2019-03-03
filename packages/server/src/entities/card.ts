import { Entity, IEntityOptions } from "../entity"
import { def } from "@cardsgame/utils"
import { nosync } from "../decorators"

export class Card extends Entity {
  @nosync
  id: EntityID
  type = "card"

  faceUp: boolean
  rotated: number
  // Publically known to be "marked" in some way.
  marked: boolean

  constructor(options: ICardOptions) {
    super(options)

    this.faceUp = def(options.faceUp, false)
    this.rotated = def(options.rotated, 0)
    this.marked = def(options.marked, false)

    this.visibleToPublic = this.faceUp
  }

  flip() {
    this.faceUp = !this.faceUp
    this.updateVisibleToPublic()
  }
  show() {
    this.faceUp = true
    this.updateVisibleToPublic()
  }
  hide() {
    this.faceUp = false
    this.updateVisibleToPublic()
  }
  updateVisibleToPublic() {
    this.visibleToPublic = this.faceUp
    this.sendAllPrivateAttributes()
  }
}

export interface ICardOptions extends IEntityOptions {
  faceUp?: boolean
  rotated?: number
  marked?: boolean
}
