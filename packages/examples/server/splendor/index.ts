import { Room, ActionTemplate, Deck } from "@cardsgame/server"
import { SplendorState } from "./state"
import {
  Gems,
  Card,
  cardsDataLevel1,
  cardsDataLevel2,
  cardsDataLevel3
} from "./entities/card"

export class SplendorRoom extends Room<SplendorState> {
  name = "Splendor"

  possibleActions = new Set<ActionTemplate>([])

  onSetupGame(options: any = {}) {
    this.setState(
      new SplendorState({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    const { state } = this

    const deckLevel1 = new Deck({
      state,
      name: "level1",
      x: -100
    })
    const deckLevel2 = new Deck({
      state,
      name: "level2"
    })
    const deckLevel3 = new Deck({
      state,
      name: "level3",
      x: 100
    })

    cardsFactory(state, cardsDataLevel1, { level: 1, parent: deckLevel1 })
    cardsFactory(state, cardsDataLevel2, { level: 2, parent: deckLevel2 })
    cardsFactory(state, cardsDataLevel3, { level: 3, parent: deckLevel3 })
  }

  onStartGame(state: SplendorState) {}
}

const cardsFactory = (
  state: SplendorState,
  data: number[][],
  { level, parent }: { level: number; parent: Deck }
): Card[] => {
  return data.map(data => {
    const [costD, costS, costE, costR, costO, vp] = data
    let gem: Gems
    if (data[6]) gem = Gems.Diamond
    else if (data[7]) gem = Gems.Sapphire
    else if (data[8]) gem = Gems.Emerald
    else if (data[9]) gem = Gems.Ruby
    else if (data[10]) gem = Gems.Onyx

    return new Card({
      state,
      costD,
      costS,
      costE,
      costR,
      costO,
      vp,
      gem,
      level,
      parent
    })
  })
}
