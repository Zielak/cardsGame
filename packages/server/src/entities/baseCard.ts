import { Entity, IEntityOptions } from "../entity"
import { def } from "@cardsgame/utils"
import { Client } from "colyseus"
import { type } from "@colyseus/schema"

export class BaseCard extends Entity {
  type = "card"

  @type("boolean")
  faceUp: boolean

  @type("uint16")
  rotated: number

  // Publically known to be "marked" in some way.
  @type("boolean")
  marked: boolean

  constructor(options: IBaseCardOptions) {
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
    // this.sendAllPrivateAttributes()
  }
}

export interface IBaseCardOptions extends IEntityOptions {
  faceUp?: boolean
  rotated?: number
  marked?: boolean
}

export const faceDownOnlyOwner = (my: BaseCard, client: any): boolean => {
  // 1. To everyone only if it's faceUp
  // 2. To owner, only if it's in his hands
  return (
    my.faceUp ||
    (my.owner.clientID === (client as Client).id &&
      my.parentEntity.type === "hand")
  )
}
