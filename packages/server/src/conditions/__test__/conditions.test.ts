import {
  SmartEntity,
  SmartParent,
} from "../../__test__/helpers/smartEntities.js"
import { ClassicCard } from "../../entities/classicCard.js"
import { Hand } from "../../entities/hand.js"
import { State } from "../../state/state.js"
import type { ChildTrait } from "../../traits/child.js"
import { setFlag, getFlag } from "../utils.js"

import { ConditionsTest } from "./conditions.js"

let state: State
let parent: SmartParent
let child: SmartEntity
let top: SmartEntity
let bottom: SmartEntity
let con: ConditionsTest<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  bottom = new SmartEntity(state, { parent, name: "childTop" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childBottom" })

  con = new ConditionsTest(state, { example: "foo" })
})

test("all chainers", () => {
  expect(con().has).toBe(con())
  expect(con().to).toBe(con())
  expect(con().be).toBe(con())
  expect(con().is).toBe(con())
  expect(con().and).toBe(con())
  expect(con().can).toBe(con())
})

describe("custom error", () => {
  it("remembers message in a flag", () => {
    const error = "Hello"
    const coreRef = con(error)

    expect(getFlag(coreRef, "customError")).toBe(error)
  })
  it("resets the message after each call", () => {
    const error = "Hello"
    const coreRef1 = con(error)
    const coreRef2 = con()

    expect(getFlag(coreRef1, "customError")).toBeUndefined()
    expect(getFlag(coreRef2, "customError")).toBeUndefined()
  })
})

test("it's a reference to the same core on each call", () => {
  const coreRef1 = con()
  const coreRef2 = con()

  expect(coreRef1 === coreRef2).toBe(true)
})

describe("constructor", () => {
  it("defines initial subjects", () => {
    expect(con().subject.example.grab()).toBe("foo")
  })

  it("resets back to default subject", () => {
    expect(con().subject.example.grab()).toBe("foo")
    expect(con().grab()).toBe(state)
  })
})

describe("references/aliases", () => {
  test("parent", () => {
    con().query({ name: "parent" }).as("parent")

    expect(con().grab()).toBe(state)
    expect(con().get("parent").grab()).toBe(parent)
  })
})

describe("subject changing", () => {
  test("entity", () => {
    expect(con().grab()).toBe(state)
    expect(con().subject.example.grab()).toBe("foo")
  })

  test("children", () => {
    expect(con().grab()).toBe(state)
    con().query({ name: "parent" }).as("parent")

    const subject = con().get("parent").children.grab<ChildTrait[]>()
    expect(Array.isArray(subject)).toBeTruthy()
    expect(subject.length).toBe(5)
    expect(subject).toContain(child)
  })

  describe("checking multiple props", () => {
    it("passes", () => {
      // TODO: move this test to grouping tests
      const cards = [
        { rank: "K", suit: "H" },
        { rank: "K", suit: "S" },
      ]
      expect(() => {
        con()
          .set(cards)
          .every((con, item, index: number, collection) => {
            expect(con().grab()).toBe(cards[index])
            expect(item).toBe(cards[index])

            con().its("rank").equals("K").and.its("suit").oneOf(["S", "H"])
          })
      }).not.toThrow()
    })

    it("fails as expected, one non-match", () => {
      expect(() => {
        con()
          .set([
            { rank: "5", suit: "H" },
            { rank: "K", suit: "S" },
          ])
          .every((con) => {
            con().its("rank").equals("K").and.its("suit").oneOf(["S", "H"])
          })
      }).toThrow()

      expect(() => {
        con()
          .set([
            { rank: "K", suit: "H" },
            { rank: "5", suit: "D" },
          ])
          .every((con) => {
            con().its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).toThrow()
    })
    it("fails as expected, all non-match", () => {
      expect(() => {
        con()
          .set([
            { rank: "5", suit: "D" },
            { rank: "K", suit: "D" },
          ])
          .every((con) => {
            con().its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).toThrow()
    })
  })
})

describe("nthChild", () => {
  test("valid cases", () => {
    con().query({ name: "parent" }).as("parent")

    // Entities
    expect(() => con().get("parent").nthChild(0).equals(bottom)).not.toThrow()
    expect(() => con().get("parent").nthChild(2).equals(child)).not.toThrow()
    expect(() => con().get("parent").nthChild(4).equals(top)).not.toThrow()

    // Simple array
    expect(() => con().set([0, 1, 2, 3]).nthChild(0).equals(0)).not.toThrow()
    expect(() => con().set([0, 1, 2, 3]).nthChild(0).equals(3)).toThrow()
  })

  test("invalid cases", () => {
    // Error
    expect(() => con().set(1234).nthChild(1)).toThrow()
  })
})

test("bottom", () => {
  con().query({ name: "parent" }).as("parent")

  expect(() => con().get("parent").bottom.equals(bottom)).not.toThrow()
  expect(() => con().get("parent").bottom.equals(top)).toThrow()

  expect(() => con().set([0, 1, 2, 3]).bottom.equals(0)).not.toThrow()
  expect(() => con().set([0, 1, 2, 3]).bottom.equals(3)).toThrow()

  expect(() => con().set("string").bottom).toThrow()
  expect(() => con().set(10).bottom).toThrow()
  expect(() => con().set(null).bottom).toThrow()
})

test("top", () => {
  con().query({ name: "parent" }).as("parent")

  expect(() => con().get("parent").top.equals(top)).not.toThrow()
  expect(() => con().get("parent").top.equals(bottom)).toThrow()

  expect(() => con().set([0, 1, 2, 3]).top.equals(3)).not.toThrow()
  expect(() => con().set([0, 1, 2, 3]).top.equals(0)).toThrow()

  expect(() => con().set("string").top).toThrow()
  expect(() => con().set(10).top).toThrow()
  expect(() => con().set(null).top).toThrow()
})

test("length", () => {
  expect(() => con().set("12345").itsLength.equals(5)).not.toThrow()
  expect(() => con().set(["a", "b", "c"]).itsLength.equals(3)).not.toThrow()

  expect(() =>
    con()
      .set(function () {})
      .itsLength.equals(0)
  ).not.toThrow()
  expect(() => con().set(500).itsLength).toThrow()
})

describe("selection", () => {
  beforeEach(() => {
    const hand = new Hand(state)
    new ClassicCard(state, { parent: hand })
    new ClassicCard(state, { parent: hand })
    new ClassicCard(state, { parent: hand })
    hand.selectChildAt(0)
    hand.selectChildAt(2)
  })
  describe("selectedChildren", () => {
    it("works with proper setup", () => {
      expect(() =>
        con().query({ type: "hand" }).selectedChildren.itsLength.equals(2)
      ).not.toThrow()
      expect(() =>
        con().query({ type: "hand" }).selectedChildren.itsLength.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con().set([1, 2, 3]).selectedChildren).toThrow(
        /to be parent/
      )
      expect(() => con().set(parent).selectedChildren).toThrow(
        /are not selectable/
      )
    })
  })

  describe("unselectedChildren", () => {
    it("works with proper setup", () => {
      expect(() =>
        con().query({ type: "hand" }).unselectedChildren.itsLength.equals(1)
      ).not.toThrow()
      expect(() =>
        con().query({ type: "hand" }).unselectedChildren.itsLength.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con().set([1, 2, 3]).unselectedChildren).toThrow(
        /to be parent/
      )
      expect(() => con().set(parent).unselectedChildren).toThrow(
        /are not selectable/
      )
    })
  })

  describe("selectedChildrenCount", () => {
    it("works with proper setup", () => {
      expect(() =>
        con().query({ type: "hand" }).selectedChildrenCount.equals(2)
      ).not.toThrow()
      expect(() =>
        con().query({ type: "hand" }).selectedChildrenCount.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con().set([1, 2, 3]).selectedChildrenCount).toThrow(
        /to be parent/
      )
      expect(() => con().set(parent).selectedChildrenCount).toThrow(
        /are not selectable/
      )
    })
  })

  describe("unselectedChildrenCount", () => {
    it("works with proper setup", () => {
      expect(() =>
        con().query({ type: "hand" }).unselectedChildrenCount.equals(1)
      ).not.toThrow()
      expect(() =>
        con().query({ type: "hand" }).unselectedChildrenCount.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con().set([1, 2, 3]).unselectedChildrenCount).toThrow(
        /to be parent/
      )
      expect(() => con().set(parent).unselectedChildrenCount).toThrow(
        /are not selectable/
      )
    })
  })
})

test("childrenCount", () => {
  con().query({ name: "parent" }).as("parent")
  expect(() => con().get("parent").childrenCount.equals(5)).not.toThrow()
})

describe("setFlag", () => {
  it("throws with invalid target", () => {
    expect(() => {
      setFlag({}, "subject", "foo")
    }).toThrow(/Incompatible target/)
  })
})
