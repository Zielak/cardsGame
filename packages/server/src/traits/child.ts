import { def } from "@cardsgame/utils"
import { State } from "../state"
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
  isInteractive() {
    if (this.parent.hijacksInteractionTarget) {
      return false
    }
    return true
  }

  /**
   * @returns array of indexes for this entity access
   */
  getIdxPath(): number[] {
    const path: number[] = [this.idx]

    const next = (entity: ChildTrait) => {
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

;(ChildTrait as any).typeDef = { idx: "number" }
;(ChildTrait as any).trait = function ChildTrait(
  state: State,
  options: Partial<ChildTrait> = {}
) {
  def(options.parent, state).addChild(this)

  if (typeof options.idx === "number") {
    this.parent.moveChildTo(this.idx, options.idx)
  }
}
