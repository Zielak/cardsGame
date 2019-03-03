import * as colyseus from "colyseus.js"
import { Container } from "pixi.js"
import { deg2rad } from "../../shared/numbers"
import { logs } from "../logs"
import { EntityEvents } from "../../shared/events"

export class EntityView extends Container {
  isContainer: boolean = false
  disablesTargetingChildren: boolean = false

  constructor(protected data: ClientEntityData) {
    super()

    this.on("attributeChanged", (change: AttributeChangeData) => {
      if (change.name === "selected" && change.value === undefined) {
        // Don't remember "unknown" selected state, and don't act on it.
        return
      } else {
        this.data[change.name] = change.value
      }
      switch (change.name) {
        case "x":
          this.x = parseFloat(change.value)
          break
        case "y":
          this.y = parseFloat(change.value)
          break
        case "angle":
          this.rotation = deg2rad(parseFloat(change.value))
          break
      }
    })

    this.on(EntityEvents.childAdded, (change: colyseus.DataChange) => {
      this.data.children[change.path.idx] = change.value
    })
    this.on(EntityEvents.childRemoved, (change: colyseus.DataChange) => {
      delete this.data.children[change.path.idx]
    })
  }

  /**
   * Overrides PIXI's property to set its `interactive` dynamically
   * depending on type of parent container (if any)
   * for example: you can't click a card in the middle of Pile or Deck.
   * // TODO: this kind of "redirection of interaction target" should
   * // probably happen on server-side. Player should be direected to interact
   * // with top-item if he clicks either PILE itself or any CARD in the middle
   */
  get interactive() {
    // const parent = (this.parent as unknown) as EntityView
    // if (!parent.isContainer) {
    // 	return true
    // } else if (!parent.disablesTargetingChildren) {
    // 	return true
    // } else if (this.idx === Object.keys(parent.data.children).length - 1) {
    // 	// If its the top element in container
    // 	return true
    // }
    return true
  }

  get id() {
    return this.data.id
  }
  get idx() {
    return this.data.idx
  }

  get idxPath(): number[] {
    const path: number[] = [this.idx]
    const getNext = (object: EntityView) => {
      const parentsIdx = (object.parent as EntityView).idx
      if (
        object.parent instanceof EntityView &&
        typeof parentsIdx === "number"
      ) {
        path.unshift(parentsIdx)
        getNext(object.parent)
      }
    }
    getNext(this)

    return path
  }
}
