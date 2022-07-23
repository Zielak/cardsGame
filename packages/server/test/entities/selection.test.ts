import { Selection } from "../../src/entities/selection"
import { State } from "../../src/state"

let state: State
let selection: Selection

beforeEach(() => {
  state = new State()
})

describe("hijacksInteractionTarget", () => {
  it("is set from construction options", () => {
    selection = new Selection(state)
    expect(selection.hijacksInteractionTarget).toBe(true)

    selection = new Selection(state, {})
    expect(selection.hijacksInteractionTarget).toBe(true)

    selection = new Selection(state, { hijacksInteractionTarget: false })
    expect(selection.hijacksInteractionTarget).toBe(false)
  })
})
