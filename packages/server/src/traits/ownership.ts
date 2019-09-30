import { def } from "@cardsgame/utils"
import { Player } from "../player"
import { State } from "../state"
import { getParentEntity, isChild } from "./child"
import { isParent } from "./parent"

export function hasOwnership(entity: any): entity is OwnershipTrait {
  return (
    "owner" in (entity as OwnershipTrait) &&
    "ownerID" in (entity as OwnershipTrait)
  )
}

export class OwnershipTrait {
  owner: Player

  ownerID: string
  isInOwnersView: boolean

  constructor(state: State, options: Partial<OwnershipTrait> = {}) {
    this.owner = def(options.owner, undefined)
    this.ownerID = def(this.owner && this.owner.clientID, undefined)
    this.isInOwnersView = def(options.isInOwnersView, false)
  }
}

;(OwnershipTrait as any).typeDef = {
  ownerID: "string",
  isInOwnersView: "boolean"
}
/**
 * Get the real owner of this thing, by traversing `this.parent` chain.
 * Owner could be set on an element or container, meaning every element in
 * such container belongs to one owner.
 *
 * @returns `Player` or `undefined` if this container doesn't belong to anyone
 */
export function getOwner(state: State, entity): Player {
  if (!hasOwnership(entity)) {
    return
  }
  if (entity.owner) {
    return entity.owner
  }
  if (isChild(entity)) {
    const parent = getParentEntity(state, entity)

    if (isParent(parent) && hasOwnership(parent)) {
      if (parent.owner) {
        return parent.owner
      }
      return getOwner(state, parent)
    }
  }
}
