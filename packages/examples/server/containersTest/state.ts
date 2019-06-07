import { State, IStateOptions } from "@cardsgame/server"
import { type } from "@colyseus/schema"

export class ContainersTestState extends State {
  @type("boolean")
  cardPicked: boolean

  constructor(options: IStateOptions) {
    super(options)
    this.cardPicked = false
  }
}
