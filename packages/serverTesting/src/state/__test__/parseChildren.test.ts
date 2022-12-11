import { State } from "@cardsgame/server"
import { ClassicCard, Container, Hand } from "@cardsgame/server/entities"

import { parseChildren } from "../parseChildren.js"

let state: State

beforeEach(() => {
  state = new State()
})

describe("parent", () => {
  it("adds child to correct parent", () => {
    const container = new Container(state)
    const hand = new Hand(state, { parent: container })

    parseChildren(state, hand, {
      children: [{ name: "SK" }],
    })

    expect(state.countChildren()).toBe(1)

    expect(container.countChildren()).toBe(1)
    expect(hand.countChildren()).toBe(1)

    expect(container.getChild(0)).toBe(hand)
    expect(hand.getChild<ClassicCard>(0).name).toBe("SK")
  })
})

describe("selection", () => {
  test("selects the only child", () => {
    const hand = new Hand(state)

    parseChildren(state, hand, {
      children: [{ name: "SK" }],
      selected: [0],
    })

    expect(hand.countChildren()).toBe(1)
    expect("selected" in hand).toBeFalsy()
    expect(hand.getSelectionIndex(0)).toBe(0)
    expect(hand.getSelectedChildren().length).toBe(1)
  })

  test("selects every other child", () => {
    const hand = new Hand(state)

    parseChildren(state, hand, {
      children: [
        { name: "C2" },
        { name: "C3" },
        { name: "C4" },
        { name: "C5" },
        { name: "C6" },
      ],
      selected: [3, 1],
    })

    expect(hand.countChildren()).toBe(5)
    expect("selected" in hand).toBeFalsy()
    expect(JSON.stringify(hand.selectedChildren)).toBe(
      JSON.stringify([
        { childIndex: 3, selectionIndex: 0 },
        { childIndex: 1, selectionIndex: 1 },
      ])
    )
    expect(hand.getSelectionIndex(0)).toBe(undefined)
    expect(hand.getSelectionIndex(1)).toBe(1)
    expect(hand.getSelectionIndex(2)).toBe(undefined)
    expect(hand.getSelectionIndex(3)).toBe(0)
    expect(hand.getSelectionIndex(4)).toBe(undefined)
    expect(hand.getSelectedChildren().length).toBe(2)
  })
})
