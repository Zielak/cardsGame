import { State } from "@cardsgame/server"

export class MakaoState extends State {
  atackPoints: number
  // [4]
  skipPoints: number
  // Ace
  requestedSuit: string
  // Jack
  requestedRank: string

  turnSkips: {
    [key: string]: number
  }

  get isAtWar(): boolean {
    return this.atackPoints > 0
  }
}
