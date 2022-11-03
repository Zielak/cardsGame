import { State } from "../../state/state.js"
import { Selection } from "../selection.js"

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

it("doesn't accept `parent` option", () => {
  const options = { parent: state }
  selection = new Selection(state, options)

  expect("parent" in options).toBe(false)
})
