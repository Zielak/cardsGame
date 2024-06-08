import { State } from "@/state/state.js"

import { Container } from "../container.js"

let state: State
let container: Container

beforeEach(() => {
  state = new State()
})

describe("hijacksInteractionTarget", () => {
  it("is set from construction options", () => {
    container = new Container(state)
    expect(container.hijacksInteractionTarget).toBe(false)

    container = new Container(state, {})
    expect(container.hijacksInteractionTarget).toBe(false)

    container = new Container(state, { hijacksInteractionTarget: true })
    expect(container.hijacksInteractionTarget).toBe(true)
  })
})
