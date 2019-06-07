import {
  Room,
  Deck,
  ClassicCard,
  commands,
  logs,
  standardDeckFactory,
  State,
  Hand
} from "@cardsgame/server"

export class ShuffleTest extends Room<State> {
  name = "ShuffleTest"

  deck: Deck
  hand: Hand

  onSetupGame(options: any = {}) {
    this.setState(
      new State({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    const { state } = this
    logs.info("Shuffle Test", `setting up the game`)

    this.hand = new Hand({
      state,
      name: "mainHand",
      x: 0
    })
    standardDeckFactory().forEach(data => {
      new ClassicCard({
        state,
        parent: this.hand,
        suit: data.suit,
        rank: data.rank,
        faceUp: true
      })
    })
  }

  onStartGame() {
    const { state } = this

    new commands.ShuffleChildren(this.hand).execute(state)

    logs.info("Final state HELLO")
    state.logTreeState()
  }
}
