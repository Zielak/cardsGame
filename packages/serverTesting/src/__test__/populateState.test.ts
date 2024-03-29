/* eslint-disable jest/expect-expect */
import { defaultHandOfCardsSorting, State } from "@cardsgame/server"
import type { ClassicCard, Hand } from "@cardsgame/server/entities"

import { objectsNamed } from "../entityDefinitionHelpers.js"
import {
  PopulateState,
  populateState,
  populateStateSetup,
} from "../populateState.js"
import type { PopulateStateTuple } from "../types.js"

let state: State
let args: PopulateStateTuple[]
let populateStateInner: PopulateState<State>
const stateGetter = (): State => state

beforeAll(() => {
  populateStateInner = populateStateSetup(stateGetter)
})
beforeEach(() => {
  state = new State()
})

describe("adds child directly to empty state", () => {
  beforeEach(() => {
    args = [[null, { children: [{ name: "S10" }] }]]
  })

  function outcome(): void {
    expect(state.countChildren()).toBe(1)
    expect(state.getBottom<ClassicCard>().name).toBe("S10")
    expect(state.getBottom<ClassicCard>().rank).toBe("10")
    expect(state.getBottom<ClassicCard>().suit).toBe("S")
  }

  test("populateStateInner", () => {
    populateStateInner(...args)
    outcome()
  })
  test("populateState", () => {
    populateState(state, args)
    outcome()
  })
})

describe("adds children to existing hand", () => {
  beforeEach(() => {
    populateStateInner([null, { children: [{ type: "hand" }] }])
    args = [[{ type: "hand" }, { children: [{ name: "S10" }] }]]
  })

  function outcome(): void {
    expect(state.countChildren()).toBe(1)
    expect(state.getBottom<Hand>().type).toBe("hand")

    const hand = state.query<Hand>({ type: "hand" })

    expect(hand.countChildren()).toBe(1)
    expect(hand.getBottom<ClassicCard>().name).toBe("S10")
    expect(hand.getBottom<ClassicCard>().rank).toBe("10")
    expect(hand.getBottom<ClassicCard>().suit).toBe("S")
  }

  test("populateStateInner", () => {
    populateStateInner(...args)
    outcome()
  })
  test("populateState", () => {
    populateState(state, args)
    outcome()
  })
})

describe("to existing hand with autoSorting, add and select the FIRST DEFINED card - HK", () => {
  // AutoSorting will sort cards switching up their IDXes anyway
  // But at the time of definition, we don't know what IDX will our first card
  // of the array be assigned with
  let hand: Hand
  beforeEach(() => {
    populateStateInner([null, { children: [{ type: "hand" }] }])
    hand = state.query<Hand>({ type: "hand" })
    hand.autoSort = defaultHandOfCardsSorting

    args = [
      [
        { type: "hand" },
        { children: objectsNamed(["HK", "DK", "CK"]), selected: [0] },
      ],
    ]
  })

  function outcome(): void {
    expect(state.countChildren()).toBe(1)
    expect(state.getBottom<Hand>().type).toBe("hand")

    expect(hand.countChildren()).toBe(3)
    expect(hand.getSelectedChildren<ClassicCard>().length).toBe(1)
    expect(hand.getSelectedChildren<ClassicCard>()[0].name).toBe("HK")
  }

  test("populateStateInner", () => {
    populateStateInner(...args)
    outcome()
  })
  test("populateState", () => {
    populateState(state, args)
    outcome()
  })
})

describe("appends some values to existing entities", () => {
  beforeEach(() => {
    populateStateInner([
      null,
      {
        children: [{ type: "hand", children: [{ name: "S10" }] }],
      },
    ])
    args = [
      [{ type: "hand" }, { name: "namedHand" }],
      [{ name: "S10" }, { faceUp: false }],
    ]
  })

  function outcome(): void {
    expect(state.countChildren()).toBe(1)

    const hand = state.query<Hand>({ type: "hand" })

    expect(hand.type).toBe("hand")
    expect(hand.name).toBe("namedHand")

    expect(hand.countChildren()).toBe(1)

    const card = hand.getBottom<ClassicCard>()

    expect(card.name).toBe("S10")
    expect(card.rank).toBe("10")
    expect(card.suit).toBe("S")
    expect(card.faceUp).toBe(false)
  }

  test("populateStateInner", () => {
    populateStateInner(...args)
    outcome()
  })
  test("populateState", () => {
    populateState(state, args)
    outcome()
  })
})

describe("throws when adding child to non-parent", () => {
  beforeEach(() => {
    populateStateInner([
      null,
      {
        children: [{ name: "S10" }],
      },
    ])
    args = [[{ name: "S10" }, { children: [{ name: "SA" }] }]]
  })

  test("populateStateInner", () => {
    expect(() => populateStateInner(...args)).toThrow()
  })
  test("populateState", () => {
    expect(() => populateState(state, args)).toThrow()
  })
})
