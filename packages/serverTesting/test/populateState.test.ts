/* eslint-disable jest/expect-expect */
import { ClassicCard, Hand, State } from "@cardsgame/server"
import { initState } from "src/initState"
import {
  PopulateState,
  populateState,
  populateStateSetup,
} from "src/populateState"
import type { StateMockingTuple } from "src/types"

let state: State
let args: StateMockingTuple[]
let populateStateInner: PopulateState<State>
const stateGetter = () => state

beforeAll(() => {
  populateStateInner = populateStateSetup(stateGetter)
})
beforeEach(() => {
  state = undefined
})

describe("adds child directly to empty state", () => {
  beforeEach(() => {
    state = new State()
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
    state = initState({ children: [{ type: "hand" }] })
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

describe("appends some values to existing entities", () => {
  beforeEach(() => {
    state = initState({
      children: [{ type: "hand", children: [{ name: "S10" }] }],
    })
    args = [
      [{ type: "hand" }, { name: "namedHand" }],
      [{ name: "S10" }, { faceUp: false }],
    ]
  })

  function outcome() {
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
    state = initState({
      children: [{ name: "S10" }],
    })
    args = [[{ name: "S10" }, { children: [{ name: "SA" }] }]]
  })

  test("populateStateInner", () => {
    expect(() => populateStateInner(...args)).toThrow()
  })
  test("populateState", () => {
    expect(() => populateState(state, args)).toThrow()
  })
})
