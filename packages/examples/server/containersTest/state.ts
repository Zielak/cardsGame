import { State, IStateOptions, type } from "@cardsgame/server"

export class ContainersTestState extends State {
  @type("boolean")
  cardPicked: boolean

  constructor(options: IStateOptions) {
    super(options)
    this.cardPicked = false
  }
}
