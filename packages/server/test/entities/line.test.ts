import { Line } from "../../src/entities/line"
import { State } from "../../src/state"

let state: State
let line: Line

beforeEach(() => {
  state = new State()
})

describe("hijacksInteractionTarget", () => {
  it("is set from construction options", () => {
    line = new Line(state)
    expect(line.hijacksInteractionTarget).toBe(false)

    line = new Line(state, {})
    expect(line.hijacksInteractionTarget).toBe(false)

    line = new Line(state, { hijacksInteractionTarget: true })
    expect(line.hijacksInteractionTarget).toBe(true)
  })
})
