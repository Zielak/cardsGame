import { childrenOf, ICondition } from "../../../src/conditions"
import { State } from "../../../src/state"
import { ConstructedParent } from "../../helpers/dumbParent"
import { ClassicCard } from "../../../src/entities/classicCard"

let state: State
let parent: ConstructedParent
let cond: ICondition

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe("#matchRank", () => {
  beforeEach(() => {
    parent = new ConstructedParent({ state })
    new ClassicCard({ state, parent, rank: "H", suit: "2" })
    new ClassicCard({ state, parent, rank: "H", suit: "3" })
    new ClassicCard({ state, parent, rank: "H", suit: "4" })
    new ClassicCard({ state, parent, rank: "H", suit: "5" })
  })
  test("single string", () => {
    cond = childrenOf(parent).matchRank("H")
    expect(cond(state, {})).toBe(true)

    cond = childrenOf(parent).matchRank("S")
    expect(cond(state, {})).toBe(false)
  })

  test("array of string", () => {
    cond = childrenOf(parent).matchRank(["H", "S", "A"])
    expect(cond(state, {})).toBe(true)

    cond = childrenOf(parent).matchRank(["S", "A", "C"])
    expect(cond(state, {})).toBe(false)
  })
})

describe("#matchSuit", () => {
  beforeEach(() => {
    parent = new ConstructedParent({ state })
  })

  test("single string", () => {
    new ClassicCard({ state, parent, rank: "H", suit: "2" })
    new ClassicCard({ state, parent, rank: "S", suit: "2" })
    new ClassicCard({ state, parent, rank: "C", suit: "2" })
    new ClassicCard({ state, parent, rank: "D", suit: "2" })

    cond = childrenOf(parent).matchSuit("2")
    expect(cond(state, {})).toBe(true)

    cond = childrenOf(parent).matchSuit("Q")
    expect(cond(state, {})).toBe(false)
  })

  test("array of string", () => {
    new ClassicCard({ state, parent, rank: "H", suit: "2" })
    new ClassicCard({ state, parent, rank: "S", suit: "2" })
    new ClassicCard({ state, parent, rank: "C", suit: "4" })
    new ClassicCard({ state, parent, rank: "D", suit: "4" })

    cond = childrenOf(parent).matchSuit(["2", "4"])
    expect(cond(state, {})).toBe(true)

    cond = childrenOf(parent).matchSuit(["2", "10"])
    expect(cond(state, {})).toBe(false)
  })
})
