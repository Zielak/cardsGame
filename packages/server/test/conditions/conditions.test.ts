import { ChildTrait } from "../../src"
import { setFlag } from "../../src/conditions/utils"
import { ClassicCard } from "../../src/entities/classicCard"
import { Hand } from "../../src/entities/hand"
import { State } from "../../src/state/state"
import { ConditionsMock } from "../helpers/conditionsMock"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let parent: SmartParent
let child: SmartEntity
let top: SmartEntity
let bottom: SmartEntity
let con: ConditionsMock<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  bottom = new SmartEntity(state, { parent, name: "childTop" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childBottom" })

  con = new ConditionsMock<State>(state, { example: "foo" })
})

test("all chainers", () => {
  expect(con().has).toBe(con())
  expect(con().to).toBe(con())
  expect(con().be).toBe(con())
  expect(con().is).toBe(con())
  expect(con().and).toBe(con())
  expect(con().can).toBe(con())
})

describe("constructor", () => {
  it("defines all props", () => {
    expect(con().grabState()).toBe(state)
    expect(con.example.grab()).toBe("foo")
  })

  it("resets back to default subject", () => {
    expect(con.example.grab()).toBe("foo")
    expect(con().grab()).toBe(state)
  })
})

describe("references/aliases", () => {
  test("parent", () => {
    con({ name: "parent" }).as("parent")

    expect(con().grab()).toBe(state)
    expect(con("parent").grab()).toBe(parent)
  })
})

describe("subject changing", () => {
  test("entity", () => {
    expect(con().grab()).toBe(state)
    expect(con.example.grab()).toBe("foo")
  })

  test("children", () => {
    expect(con().grab()).toBe(state)
    con({ name: "parent" }).as("parent")

    const subject = con("parent").children.grab<ChildTrait[]>()
    expect(Array.isArray(subject)).toBeTruthy()
    expect(subject.length).toBe(5)
    expect(subject).toContain(child)
  })

  describe("checking multiple props", () => {
    it("passes", () => {
      expect(() => {
        con()
          .set([
            { rank: "K", suit: "H" },
            { rank: "K", suit: "S" },
          ])
          .every((con) => {
            con().its("rank").equals("K").its("suit").oneOf(["S", "H"])
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
            con().its("rank").equals("K").its("suit").oneOf(["S", "H"])
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
    con({ name: "parent" }).as("parent")

    // Entities
    expect(() => con("parent").nthChild(0).equals(bottom)).not.toThrow()
    expect(() => con("parent").nthChild(2).equals(child)).not.toThrow()
    expect(() => con("parent").nthChild(4).equals(top)).not.toThrow()

    // Simple array
    expect(() => con().set([0, 1, 2, 3]).nthChild(0).equals(0)).not.toThrow()
    expect(() => con().set([0, 1, 2, 3]).nthChild(0).equals(3)).toThrow()
  })

  test("invalid cases", () => {
    // Error
    expect(() => con().set("string").nthChild(1)).toThrow()
  })
})

test("bottom", () => {
  con({ name: "parent" }).as("parent")
  expect(() => con("parent").bottom.equals(bottom)).not.toThrow()
  expect(() => con("parent").bottom.equals(top)).toThrow()

  expect(() => con().set([0, 1, 2, 3]).bottom.equals(0)).not.toThrow()
  expect(() => con().set([0, 1, 2, 3]).bottom.equals(3)).toThrow()

  expect(() => con().set("string").bottom).toThrow()
  expect(() => con().set(10).bottom).toThrow()
  expect(() => con().set(null).bottom).toThrow()
})

test("top", () => {
  con({ name: "parent" }).as("parent")
  expect(() => con("parent").top.equals(top)).not.toThrow()
  expect(() => con("parent").top.equals(bottom)).toThrow()

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
        con({ type: "hand" }).selectedChildren.itsLength.equals(2)
      ).not.toThrow()
      expect(() =>
        con({ type: "hand" }).selectedChildren.itsLength.equals(0)
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
        con({ type: "hand" }).unselectedChildren.itsLength.equals(1)
      ).not.toThrow()
      expect(() =>
        con({ type: "hand" }).unselectedChildren.itsLength.equals(0)
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
        con({ type: "hand" }).selectedChildrenCount.equals(2)
      ).not.toThrow()
      expect(() =>
        con({ type: "hand" }).selectedChildrenCount.equals(0)
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
        con({ type: "hand" }).unselectedChildrenCount.equals(1)
      ).not.toThrow()
      expect(() =>
        con({ type: "hand" }).unselectedChildrenCount.equals(0)
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
  con({ name: "parent" }).as("parent")
  expect(() => con("parent").childrenCount.equals(5)).not.toThrow()
})

describe("setFlag", () => {
  it("throws with invalid target", () => {
    expect(() => {
      setFlag({}, "subject", "foo")
    }).toThrowError(/Incompatible target/)
  })
})
