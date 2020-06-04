import { MapSchema } from "@colyseus/schema"
import { mapCount } from "@cardsgame/utils"

import { type, containsChildren } from "../annotations"
import { Player } from "../player"
import { PlayerViewPosition } from "../playerViewPosition"

// Trait
import { Entity, applyTraitsMixins } from "../traits/entity"
import { IdentityTrait } from "../traits/identity"
import { LabelTrait } from "../traits/label"
import { ParentArrayTrait } from "../traits/parentArray"

@containsChildren()
@applyTraitsMixins([IdentityTrait, LabelTrait, ParentArrayTrait])
export class State extends Entity<{}> {
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
   * How much clients are connected to the room
   */
  get clientsCount(): number {
    return mapCount(this.clients)
  }

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
   * @private
   */
  _lastID = -1

  /**
   * Use `find()` or `getEntity()` methods instead
   * @private
   */
  _allEntities = new Map<number, IdentityTrait>()

  constructor() {
    super(undefined)

    this.hijacksInteractionTarget = false
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
