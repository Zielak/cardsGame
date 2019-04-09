import { Entity, IEntityOptions } from "./entities/entity"
import { EntityEvents } from "@cardsgame/utils"
import { type } from "@colyseus/schema"

export class Player extends Entity {
  type = "player"

  @type("string")
  clientID: string

  @type("number")
  score: number = 0

  @type("number")
  timeLeft: number = -1

  _selectedEntities: Set<Entity>

  @type("boolean")
  selectedEntitiesCount: number

  constructor(options: IPlayerOptions) {
    super(options)
    this.clientID = options.clientID
    this.name = getRandomName()
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

// Event from client, with stuff auto filled when comming to server
export type ServerPlayerEvent = PlayerEvent & {
  player?: Player
  entity?: Entity
  entities?: Entity[]
}

const randomPlayerNames = [
  "Bob",
  "Alicja",
  "Darek",
  "Pablo",
  "Witeck",
  "Pauline",
  "Karen",
  "Sandra",
  "Mat",
  "Gordon"
]
const getRandomName = (): string => {
  randomPlayerNames.sort(() => {
    return Math.floor(Math.random() * 3) - 1
  })
  return randomPlayerNames.pop()
}
