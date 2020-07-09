import { Conditions } from "../../src/conditions"
import { getFlag, setFlag } from "../../src/conditions/utils"
import { ClassicCard } from "../../src/entities/classicCard"
import { Hand } from "../../src/entities/hand"
import { Player, ServerPlayerEvent } from "../../src/players/player"
import { State } from "../../src/state/state"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let event: ServerPlayerEvent
let parent: SmartParent
let child: SmartEntity
let top: SmartEntity
let bottom: SmartEntity
let con: Conditions<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })

  bottom = new SmartEntity(state, { parent, name: "childTop" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childBottom" })

  event = {
    player: new Player({ clientID: "123" }),
    entity: top,
    timestamp: +new Date(),
  }

  con = new Conditions<State>(state, event)
})

test("all chainers", () => {
  expect(con.has).toBe(con)
  expect(con.to).toBe(con)
  expect(con.be).toBe(con)
  expect(con.is).toBe(con)
  expect(con.and).toBe(con)
  expect(con.can).toBe(con)
})

describe("constructor", () => {
  it("defines all props", () => {
    expect(con.grabState()).toBe(state)
    expect(con.getEvent()).toBe(event)
    expect(getFlag(con, "subject")).toBe(state)
  })

  it("defines itself as callable", () => {
    expect(() => con("test")).not.toThrow()
    con("")
  })
})

describe("references/aliases", () => {
  test("parent", () => {
    expect(con._refs.size).toBe(0)
    con.get({ name: "parent" }).as("parent")

    expect(con._refs.size).toBe(1)
    expect(con._refs.has("parent")).toBeTruthy()
    expect(con._refs.get("parent")).toBe(parent)

    expect(getFlag(con, "subject")).toBe(state)
    con.get("parent")
    expect(getFlag(con, "subject")).toBe(parent)
  })

  test("internal _player reference", () => {
    expect(con.getPlayer()).toBe(event.player)
  })

  test("get functions", () => {
    expect(con.getEvent()).toBe(event)
    expect(con.getPlayer()).toBe(event.player)
    expect(con.getState()).toBe(state)
  })
})

describe("subject changing", () => {
  test("entity", () => {
    expect(getFlag(con, "subject")).toBe(state)
    con.entity
    expect(getFlag(con, "subject")).toBe(event.entity)
  })

  test("children", () => {
    expect(getFlag(con, "subject")).toBe(state)
    con.get({ name: "parent" }).as("parent")
    con.get("parent").children

    const subject = getFlag(con, "subject")
    expect(Array.isArray(subject)).toBeTruthy()
    expect(subject.length).toBe(5)
    expect(subject).toContain(child)
  })

  describe("checking multiple props", () => {
    it("passes", () => {
      expect(() => {
        con
          .set([
            { rank: "K", suit: "H" },
            { rank: "K", suit: "S" },
          ])
          .every((con) => {
            con.its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).not.toThrow()
    })

    it("fails as expected, one non-match", () => {
      expect(() => {
        con
          .set([
            { rank: "5", suit: "H" },
            { rank: "K", suit: "S" },
          ])
          .every((con) => {
            con.its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).toThrow()

      expect(() => {
        con
          .set([
            { rank: "K", suit: "H" },
            { rank: "5", suit: "D" },
          ])
          .every((con) => {
            con.its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).toThrow()
    })
    it("fails as expected, all non-match", () => {
      expect(() => {
        con
          .set([
            { rank: "5", suit: "D" },
            { rank: "K", suit: "D" },
          ])
          .every((con) => {
            con.its("rank").equals("K").its("suit").oneOf(["S", "H"])
          })
      }).toThrow()
    })
  })

  test("player", () => {
    expect(getFlag(con, "subject")).toBe(state)
    con.player
    expect(getFlag(con, "subject")).toBe(event.player)
  })
})

describe("nthChild", () => {
  test("valid cases", () => {
    con.get({ name: "parent" }).as("parent")

    // Entities
    expect(() => con.get("parent").nthChild(0).equals(bottom)).not.toThrow()
    expect(() => con.get("parent").nthChild(2).equals(child)).not.toThrow()
    expect(() => con.get("parent").nthChild(4).equals(top)).not.toThrow()

    // Simple array
    expect(() => con.set([0, 1, 2, 3]).nthChild(0).equals(0)).not.toThrow()
    expect(() => con.set([0, 1, 2, 3]).nthChild(0).equals(3)).toThrow()
  })

  test("invalid cases", () => {
    // Error
    expect(() => con.set("string").nthChild(1)).toThrow()
  })
})

test("bottom", () => {
  con.get({ name: "parent" }).as("parent")
  expect(() => con.get("parent").bottom.equals(bottom)).not.toThrow()
  expect(() => con.get("parent").bottom.equals(top)).toThrow()

  expect(() => con.set([0, 1, 2, 3]).bottom.equals(0)).not.toThrow()
  expect(() => con.set([0, 1, 2, 3]).bottom.equals(3)).toThrow()

  expect(() => con.set("string").bottom).toThrow()
  expect(() => con.set(10).bottom).toThrow()
  expect(() => con.set(null).bottom).toThrow()
})

test("top", () => {
  con.get({ name: "parent" }).as("parent")
  expect(() => con.get("parent").top.equals(top)).not.toThrow()
  expect(() => con.get("parent").top.equals(bottom)).toThrow()

  expect(() => con.set([0, 1, 2, 3]).top.equals(3)).not.toThrow()
  expect(() => con.set([0, 1, 2, 3]).top.equals(0)).toThrow()

  expect(() => con.set("string").top).toThrow()
  expect(() => con.set(10).top).toThrow()
  expect(() => con.set(null).top).toThrow()
})

test("length", () => {
  expect(() => con.set("12345").itsLength.equals(5)).not.toThrow()
  expect(() => con.set(["a", "b", "c"]).itsLength.equals(3)).not.toThrow()

  expect(() => con.set(function () {}).itsLength.equals(0)).not.toThrow()
  expect(() => con.set(500).itsLength).toThrow()
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
        con.get({ type: "hand" }).selectedChildren.itsLength.equals(2)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).selectedChildren.itsLength.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con.set([1, 2, 3]).selectedChildren).toThrow(/to be parent/)
      expect(() => con.set(parent).selectedChildren).toThrow(
        /are not selectable/
      )
    })
  })

  describe("unselectedChildren", () => {
    it("works with proper setup", () => {
      expect(() =>
        con.get({ type: "hand" }).unselectedChildren.itsLength.equals(1)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).unselectedChildren.itsLength.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con.set([1, 2, 3]).unselectedChildren).toThrow(
        /to be parent/
      )
      expect(() => con.set(parent).unselectedChildren).toThrow(
        /are not selectable/
      )
    })
  })

  describe("selectedChildrenCount", () => {
    it("works with proper setup", () => {
      expect(() =>
        con.get({ type: "hand" }).selectedChildrenCount.equals(2)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).selectedChildrenCount.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con.set([1, 2, 3]).selectedChildrenCount).toThrow(
        /to be parent/
      )
      expect(() => con.set(parent).selectedChildrenCount).toThrow(
        /are not selectable/
      )
    })
  })

  describe("unselectedChildrenCount", () => {
    it("works with proper setup", () => {
      expect(() =>
        con.get({ type: "hand" }).unselectedChildrenCount.equals(1)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).unselectedChildrenCount.equals(0)
      ).toThrow()
    })

    it("throws with incorrect setup", () => {
      expect(() => con.set([1, 2, 3]).unselectedChildrenCount).toThrow(
        /to be parent/
      )
      expect(() => con.set(parent).unselectedChildrenCount).toThrow(
        /are not selectable/
      )
    })
  })
})

test("childrenCount", () => {
  con.get({ name: "parent" }).as("parent")
  expect(() => con.get("parent").childrenCount.equals(5)).not.toThrow()
})

describe("setFlag", () => {
  it("throws with invalid target", () => {
    expect(() => {
      setFlag({}, "data", "foo")
    }).toThrowError(/Incompatible target/)
  })
})
