import { State } from "@cardsgame/server"

interface MakaoUI {
  [id: string]: string
  suitPicker: string
  rankPicker: string
}

export class MakaoState extends State {
  atackPoints: number
  // [4]
  skipPoints: number
  // Ace - changes the color of current top card on the pile
  // duration - until someone plays a card over it
  requestedSuit: string
  // Jack - requests all the players to play only this card
  // duration - until turn gets to the requesting player
  requestedRank: string

  turnSkips: {
    [key: string]: number
  }

  get isAtWar(): boolean {
    return this.atackPoints > 0
  }

  // Which players to show specific interface
  ui: MakaoUI = {
    suitPicker: "",
    rankPicker: ""
  }
}
