import { State, IStateOptions, StateUI, Pile, Deck } from "@cardsgame/server"
import { type } from "@colyseus/schema"
import { MapSchema } from "@colyseus/schema"

interface MakaoUI extends StateUI {
  suitPicker: string
  rankPicker: string
}
export class MakaoState extends State {
  @type("uint8")
  atackPoints: number

  // [4]
  @type("uint8")
  skipPoints: number

  // Ace - changes the color of current top card on the pile
  // duration - until someone plays a card over it
  @type("string")
  requestedSuit: string

  // Jack - requests all the players to play only this card
  // duration - until turn gets to the requesting player
  @type("string")
  requestedRank: string

  @type({ map: "number" })
  turnSkips = new MapSchema<number>()

  get isAtWar(): boolean {
    return this.atackPoints > 0
  }

  ui: MakaoUI

  // Some references for main game containers
  pile: Pile
  deck: Deck

  constructor(options?: IStateOptions) {
    super(options)

    this.ui["suitPicker"] = ""
    this.ui["rankPicker"] = ""
  }

  static events = {
    ...State.events
  }
}
