import { def } from "@cardsgame/utils"

import { Player } from "../player"
import { State } from "../state"
import { isChild } from "./child"
import { isParent } from "./parent"

export function hasOwnership(entity: any): entity is OwnershipTrait {
  return (
    "owner" in (entity as OwnershipTrait) &&
    "ownerID" in (entity as OwnershipTrait)
  )
}

export class OwnershipTrait {
  protected _owner: Player
  get owner() {
    return this._owner
  }
  set owner(value: Player) {
    this._owner = value
    this.ownerID = value ? value.clientID : undefined
  }

  ownerID: string

  isInOwnersView: boolean

  /**
   * Get the real owner of this thing, by traversing `this.parent` chain.
   * Owner could be set on an element or container, meaning every element in
   * such container belongs to one owner.
   *
   * @returns `Player` or `undefined` if this container doesn't belong to anyone
   */
  getOwner(): Player {
    if (this.owner) {
      return this.owner
    }
    if (isChild(this)) {
      const parent = this.parent

      if (isParent(parent) && hasOwnership(parent)) {
        if (parent.owner) {
          return parent.owner
        }
        return parent.getOwner()
      }
    }
  }
}

;(OwnershipTrait as any).typeDef = {
  isInOwnersView: "boolean",
  ownerID: "string"
}
;(OwnershipTrait as any).trait = function OwnershipTrait(
  state: State,
  options: Partial<OwnershipTrait> = {}
) {
  this.owner = def(options.owner, undefined)
  this.isInOwnersView = def(options.isInOwnersView, false)
}
