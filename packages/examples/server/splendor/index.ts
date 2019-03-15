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

  onSetupGame(state: SplendorState) {
    const deckLevel1 = new Deck({
      state,
      name: "level1"
    })
    const deckLevel2 = new Deck({
      state,
      name: "level2"
    })
    const deckLevel3 = new Deck({
      state,
      name: "level3"
    })

    deckLevel1.addChildren(cardsFactory(state, cardsDataLevel1))
    deckLevel2.addChildren(cardsFactory(state, cardsDataLevel2))
    deckLevel3.addChildren(cardsFactory(state, cardsDataLevel3))
  }

  onStartGame(state: SplendorState) {}
}

const cardsFactory = (state: SplendorState, data: number[][]): Card[] => {
  return data.map(data => {
    let gem: Gems
    if (data[6]) gem = Gems.Diamond
    else if (data[7]) gem = Gems.Sapphire
    else if (data[8]) gem = Gems.Emerald
    else if (data[9]) gem = Gems.Ruby
    else if (data[10]) gem = Gems.Onyx

    return new Card({
      state,
      costD: data[0],
      costS: data[1],
      costE: data[2],
      costR: data[3],
      costO: data[4],
      vp: data[5],
      gem
    })
  })
}
