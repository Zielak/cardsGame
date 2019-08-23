import { State } from "../state"
import { Player } from "../player"
import { EntityTransform } from "../transform"
import {
  IParent,
  getKnownConstructor,
  countChildren,
  moveChildTo,
  removeChildAt
} from "./parent"
import { IIdentity } from "./identity"
import { def } from "@cardsgame/utils"
import { ArraySchema } from "@colyseus/schema"

export function EntityConstructor(entity: IEntity, options: IEntityOptions) {
  // state && id
  entity._state = options.state
  entity.id = entity._state.registerEntity(entity)
  if (options.name) {
    entity.name = options.name
  }
  if (options.type) {
    entity.type = options.type
  }

  // Transforms
  entity._localTransform = new EntityTransform(
    options.x,
    options.y,
    options.angle
  )
  entity._localTransform.on("update", () => updateTransform(entity))

  entity._worldTransform = new EntityTransform()
  entity._worldTransform.on("update", () => updateTransform(entity))
  updateTransform(entity)

  // Owner
  entity.owner = def(options.owner, undefined)
  entity.ownerID = def(entity.owner && entity.owner.clientID, undefined)
  entity.isInOwnersView = def(options.isInOwnersView, false)

  // Parent
  const optParent = def(options.parent, -1)
  const newParentID = typeof optParent !== "number" ? optParent.id : optParent

  const newParent =
    newParentID >= 0 ? entity._state.getEntity(newParentID) : options.state

  if (!newParent.isParent()) {
    throw new Error(
      `${options.type} constructor: given 'parent' is not really IParent and can't accept any children.`
    )
  }

  setParent(entity, newParent)

  if (typeof options.idx === "number") {
    moveChildTo(newParent, entity.idx, options.idx)
  }
}

export interface IEntity extends IIdentity {
  _state: State
  isParent(): this is IParent

  idx: number
  parent: EntityID
  owner: Player
  ownerID: string
  isInOwnersView: boolean

  type: string
  name: string

  x?: number
  y?: number
  angle?: number

  // Private stuff, author shouldn't care about these,
  // entityConstructor() should take care of initing them

  /**
   * > Current transform of the object based on local factors
   *
   * eg. author-chosen transform when creating this entity
   */
  _localTransform?: EntityTransform

  /**
   * > Current transform of the object based on world (parent) factors
   *
   * eg.transform applied by parent container
   */
  _worldTransform?: EntityTransform
}

// Entity constructor options
export interface IEntityOptions {
  state: State
  type?: string
  name?: string
  width?: number
  height?: number
  x?: number
  y?: number
  angle?: number
  parent?: EntityID | IEntity
  idx?: number
  owner?: Player
  isInOwnersView?: boolean
}

/**
 * Gets a reference to this entity's parent.
 * Root elements won't return state, but `undefined` instead.
 */
export function getParentEntity(entity: IEntity): IEntity & IParent {
  const parent = entity._state.getEntity(entity.parent)
  if (parent && parent.isParent()) {
    return parent
  }
}

export function setParent(entity: IEntity, newParent: IParent) {
  if (entity.parent !== undefined && entity.parent !== -1) {
    removeChildAt(getParentEntity(entity), entity.idx)
  }

  const con = getKnownConstructor(entity)
  const targetArray = newParent["children" + con.name] as ArraySchema<IEntity>
  targetArray.push(entity)

  entity.idx = countChildren(newParent)
  entity.parent = newParent.id
  newParent._childrenPointers.push(con.name)

  if (newParent.onChildAdded) {
    newParent.onChildAdded(entity)
  }
}

/**
 * @returns array of indexes for this entity access
 */
export function getIdxPath(entity: IEntity): number[] {
  const path: number[] = [entity.idx]

  const next = (entity: IEntity) => {
    const parent = getParentEntity(entity)
    if (!parent) {
      return
    }

    const parentsIdx = parent.idx
    if (parentsIdx !== -1) {
      path.unshift(parentsIdx)
      next(parent)
    }
  }
  next(entity)

  return path
}

/**
 * Points out if this element can be
 * target of any interaction
 */
export function isInteractive(entity: IEntity) {
  const parent = getParentEntity(entity) || entity._state
  if (parent.hijacksInteractionTarget) {
    return false
  }
  return true
}

/**
 * Get the real owner of this thing, by traversing `this.parent` chain.
 * Owner could be set on an element or container, meaning every element in
 * such container belongs to one owner.
 *
 * @returns `Player` or `undefined` if this container doesn't belong to anyone
 */
export function getOwner(entity: IEntity): Player {
  if (entity.owner) {
    return entity.owner
  }
  const parent = getParentEntity(entity)
  if (!parent) {
    return
  }
  if (parent.owner) {
    return parent.owner
  }
  return getOwner(parent)
}

export function updateTransform(entity: IEntity) {
  return ["x", "y", "angle"].map(prop => {
    entity[prop] = entity._localTransform[prop] + entity._worldTransform[prop]
  })
}

export function resetWorldTransform(entity: IEntity) {
  return ["x", "y", "angle"].map(prop => {
    entity._worldTransform[prop] = 0
  })
}
