import { Spread } from "../../src/entities/spread"
import { State } from "../../src/state"

let state: State
let spread: Spread

beforeEach(() => {
  state = new State()
})

describe("hijacksInteractionTarget", () => {
  it("is set from construction options", () => {
    spread = new Spread(state)
    expect(spread.hijacksInteractionTarget).toBe(false)

    spread = new Spread(state, {})
    expect(spread.hijacksInteractionTarget).toBe(false)

    spread = new Spread(state, { hijacksInteractionTarget: true })
    expect(spread.hijacksInteractionTarget).toBe(true)
  })
})
