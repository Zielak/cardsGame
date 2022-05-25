import { Hand } from "../../src/entities/hand"
import { State } from "../../src/state"

let state: State
let hand: Hand

beforeEach(() => {
  state = new State()
})

describe("hijacksInteractionTarget", () => {
  it("is set from construction options", () => {
    hand = new Hand(state)
    expect(hand.hijacksInteractionTarget).toBe(false)

    hand = new Hand(state, {})
    expect(hand.hijacksInteractionTarget).toBe(false)

    hand = new Hand(state, { hijacksInteractionTarget: true })
    expect(hand.hijacksInteractionTarget).toBe(true)
  })
})
