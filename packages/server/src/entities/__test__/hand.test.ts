import { State } from "../../state/state.js"
import { Hand } from "../hand.js"

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
