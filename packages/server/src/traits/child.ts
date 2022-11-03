import { ChildTraitTypeDef } from "@cardsgame/entity-traits"
import { def } from "@cardsgame/utils"

import type { State } from "../state/state.js"

import type { ParentTrait } from "./parent.js"

/**
 * @category Trait
 */
export function isChild(entity: unknown): entity is ChildTrait {
  return (
    typeof entity === "object" &&
    typeof entity["idx"] !== "undefined" &&
    typeof entity["parent"] !== "undefined"
  )
}

/**
 * **Important trait**
 *
 * Entity can become a child of any other container/parent.
 *
 * @category Trait
 */
export class ChildTrait {
  /**
   * @category ChildTrait
   */
  parent: ParentTrait

  /**
   * @category ChildTrait
   */
  idx: number

  /**
   * Points out if this element can be target of any interaction
   *
   * @category ChildTrait
   */
  isInteractive(): boolean {
    if (this.parent.hijacksInteractionTarget) {
      return false
    }
    return true
  }

  /**
   * TODO: Limit the number of automatic getters. Just make these a `getIdxPath` functions. QueryRunner grabs all the "props" and ignores functions.
   *
   * @category ChildTrait
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
