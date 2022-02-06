import { ChildTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state"

import type { ParentTrait } from "./parent"

export function isChild(entity: unknown): entity is ChildTrait {
  return (
    typeof entity === "object" &&
    typeof entity["idx"] !== "undefined" &&
    typeof entity["parent"] !== "undefined"
  )
}

export class ChildTrait {
  parent: ParentTrait

  /**
   * @memberof ChildTrait
   */
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
  isInteractive(): boolean {
    if (this.parent.hijacksInteractionTarget) {
      return false
    }
    return true
  }

  /**
   * TODO: Limit the number of automatic getters. Just make these a `getIdxPath` functions. QueryRunner grabs all the "props" and ignores functions.
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

ChildTrait["typeDef"] = ChildTraitTypeDef
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
  },
}
