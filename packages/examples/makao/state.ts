import { State } from "@cardsgame/server"

export class MakaoState extends State {
  atackPoints: number
  skipPoints: number

  turnSkips: {
    [key: string]: number
  }

  get isAtWar(): boolean {
    return this.atackPoints > 0
  }
}
