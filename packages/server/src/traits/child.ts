import { def } from "@cardsgame/utils"

import { State } from "../state/state"
import { ParentTrait } from "./parent"

export function isChild(entity: any): entity is ChildTrait {
  return (
    typeof (entity as ChildTrait).idx !== "undefined" &&
    typeof (entity as ChildTrait).parent !== "undefined"
  )
}

export class ChildTrait {
  parent: ParentTrait

  idx: number

  /**
   * Gets a reference to this entity's parent.
   * Root elements won't return state, but `undefined` instead.
   */
  // getParentEntity(state: State): ParentTrait {
  //   if (isParent(this.parent)) {
  //     return this.parent
  //   }
  // }

  /**
   * Points out if this element can be target of any interaction
   */
  get isInteractive(): boolean {
    if (this.parent.hijacksInteractionTarget) {
      return false
    }
    return true
  }

  /**
   * @returns array of indexes for this entity access
   */
  get idxPath(): number[] {
    const path: number[] = [this.idx]

    const next = (entity: ChildTrait): void => {
      const parent = entity.parent

      if (!parent) {
        return
      }
      if (isChild(parent)) {
        const parentsIdx = parent.idx

        path.unshift(parentsIdx)
        next(parent)
      }
    }
    next(this)

    return path
  }
}

ChildTrait["typeDef"] = { idx: "number" }
ChildTrait["hooks"] = {
  postConstructor: function addMyselfToParent(
    state: State,
    options: ChildTrait
  ): void {
    const targetParent = def(options.parent, state)

    if ("idx" in options) {
      targetParent.addChild(this, options.idx)
    } else {
      targetParent.addChild(this)
    }

    if (typeof options.idx === "number") {
      this.parent.moveChildTo(this.idx, options.idx)
    }
  },
}
