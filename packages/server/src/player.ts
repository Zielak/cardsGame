import { nosync } from "colyseus"
import { Entity, IEntityOptions } from "./entity"
import { EntityEvents } from "@cardsgame/utils"

export class Player extends Entity {
  type = "player"

  clientID: string
  score: number = 0
  timeLeft: number = Infinity

  @nosync
  _selectedEntities: Set<Entity>
  selectedEntitiesCount: number

  constructor(options: IPlayerOptions) {
    super(options)
    this.clientID = options.clientID
    this._selectedEntities = new Set()
  }

  /**
   * Will make this element selected in
   * the eyes of this player. This knowledge
   * is not shared with others by default.
   * @param entity
   */
  selectEntity(entity: Entity) {
    this._selectedEntities.add(entity)

    const event: PrivateAttributeChangeData = {
      path: entity.idxPath,
      owner: this.clientID,
      public: false,
      attribute: "selected",
      value: true
    }
    this._state.emit(EntityEvents.privateAttributeChange, event)

    this.selectedEntitiesCount = this._selectedEntities.size
  }

  deselectEntity(entity: Entity) {
    this._selectedEntities.delete(entity)

    const event: PrivateAttributeChangeData = {
      path: entity.idxPath,
      owner: this.clientID,
      public: false,
      attribute: "selected",
      value: false
    }
    this._state.emit(EntityEvents.privateAttributeChange, event)

    this.selectedEntitiesCount = this._selectedEntities.size
  }

  clearSelection() {
    const deselected: Entity[] = []
    for (let entity of this._selectedEntities.values()) {
      deselected.push(entity)
      this.deselectEntity(entity)
    }
    return deselected
  }

  isEntitySelected(entity: Entity): boolean {
    return this._selectedEntities.has(entity)
  }

  get selectedEntities(): Entity[] {
    return Array.from(this._selectedEntities.values())
  }
}

export interface IPlayerOptions extends IEntityOptions {
  clientID: string
}

export type PlayerEvent = {
  player?: Player
  // most likely 'click'
  type: string
  // Parsed, server-side entity reference
  target?: Entity
  // Path to target object, by idx/idx/idx...
  targetPath?: number[]
  // All entities along the path of interaction
  targets?: Entity[]
  // additional/optional data
  data?: any
}
