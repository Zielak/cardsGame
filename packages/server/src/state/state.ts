import { mapCount } from "@cardsgame/utils"
import { MapSchema } from "@colyseus/schema"

import { containsChildren } from "../annotations/containsChildren"
import { type } from "../annotations/type"
import { Player } from "../players/player"
import { PlayerViewPosition } from "../playerViewPosition"
import { applyTraitsMixins, Entity } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { ParentArrayTrait } from "../traits/parentArray"

@containsChildren()
@applyTraitsMixins([IdentityTrait, LabelTrait, ParentArrayTrait])
export class State extends Entity<Record<string, unknown>> {
  type = "state"

  @type("number") tableWidth = 60 // 60 cm

  @type("number") tableHeight = 60 // 60 cm

  /**
   * IDs of clients who are connecting to the room.
   * A "client" is someone who just stopped by in this room
   * and not necessarily someone who is playing the game.
   */
  @type({ map: "string" }) clients = new MapSchema<string>()

  /**
   * Games are turn-based by default. Each player takes their turns one by one.
   * Set this to `false` to allow simultaneous play.
   * Don't rely on `currentPlayer` value for non turn-based games.
   */
  @type("boolean") turnBased = true

  /**
   * Current round number. Increased using `NextRound` command.
   */
  @type("uint16") round = 0

  /**
   * List of player - game participants, after the game starts.
   */
  @type({ map: Player }) players = new MapSchema<Player>()

  @type("uint8") currentPlayerIdx = 0

  get currentPlayer(): Player {
    return this.turnBased ? this.players[this.currentPlayerIdx] : null
  }

  get playersCount(): number {
    return mapCount(this.players)
  }

  @type("boolean") isGameStarted = false
  @type("boolean") isGameOver = false

  @type({ map: "string" }) ui: StateUI = new MapSchema<string | string[]>()

  /**
   * A construct describing how should player's "focused" items
   * be positioned in his view. Containers of other players
   * will not follow these rules.
   * Default is: center/bottom.
   */
  @type(PlayerViewPosition) playerViewPosition = new PlayerViewPosition()

  /**
   * ID of last known, registered Entity.
   */
  private _lastID = -1

  /**
   * Map of every Entity in this state.
   */
  private readonly _allEntities = new Map<number, IdentityTrait>()

  constructor() {
    super(undefined)

    this.hijacksInteractionTarget = false
  }

  /**
   * Registers new entity to the game state.
   * @param entity
   * @private internal use only
   */
  _registerEntity(entity: IdentityTrait): void {
    if (this._allEntities.has(entity.id)) {
      if (this._allEntities.get(entity.id) !== entity) {
        throw new Error(
          "State: registering entity, which was already registered WITH DIFFERENT ID?"
        )
      }
      return
    }

    this._lastID++
    const newID = this._lastID

    Object.defineProperty(entity, "id", {
      configurable: false,
      writable: false,
      value: newID,
    })
    this._allEntities.set(newID, entity)
  }
}

interface Mixin extends IdentityTrait, LabelTrait, ParentArrayTrait {}

export interface State extends Mixin {}

export interface StateUI {
  clone: () => MapSchema
  onAdd: (item: any, key: string) => void
  onRemove: (item: any, key: string) => void
  onChange: (item: any, key: string) => void
}
