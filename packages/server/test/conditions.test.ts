import { Conditions, getConditionFlag as flag } from "../src/conditions"
import { State } from "../src/state"
import { ServerPlayerEvent, Player } from "../src/player"
import { SmartEntity, SmartParent } from "./helpers/smartEntities"
import { Hand } from "../src/entities/hand"
import { ClassicCard } from "../src/entities/index"

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
    entity: top
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
    expect(con._state).toBe(state)
    expect(con._event).toBe(event)
    expect(flag(con, "subject")).toBe(state)
  })
})

describe("references/aliases", () => {
  test("parent", () => {
    expect(con._refs.size).toBe(0)
    con.get({ name: "parent" }).as("parent")

    expect(con._refs.size).toBe(1)
    expect(con._refs.has("parent")).toBeTruthy()
    expect(con._refs.get("parent")).toBe(parent)

    expect(flag(con, "subject")).toBe(state)
    con.get("parent")
    expect(flag(con, "subject")).toBe(parent)
  })

  test("internal _player reference", () => {
    expect(con._player).toBe(event.player)
  })

  test("get functions", () => {
    expect(con.getEvent()).toBe(event)
    expect(con.getPlayer()).toBe(event.player)
    expect(con.getState()).toBe(state)
  })
})

describe("subject changing", () => {
  test("entity", () => {
    expect(flag(con, "subject")).toBe(state)
    con.entity
    expect(flag(con, "subject")).toBe(event.entity)
  })

  test("children", () => {
    expect(flag(con, "subject")).toBe(state)
    con.get({ name: "parent" }).as("parent")
    con.get("parent").children

    const subject = flag(con, "subject")
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
            { rank: "K", suit: "S" }
          ])
          .each(con => {
            con
              .its("rank")
              .equals("K")
              .its("suit")
              .oneOf(["S", "H"])
          })
      }).not.toThrow()
    })

    it("fails as expected, one non-match", () => {
      expect(() => {
        con
          .set([
            { rank: "5", suit: "H" },
            { rank: "K", suit: "S" }
          ])
          .each(con => {
            con
              .its("rank")
              .equals("K")
              .its("suit")
              .oneOf(["S", "H"])
          })
      }).toThrow()

      expect(() => {
        con
          .set([
            { rank: "K", suit: "H" },
            { rank: "5", suit: "D" }
          ])
          .each(con => {
            con
              .its("rank")
              .equals("K")
              .its("suit")
              .oneOf(["S", "H"])
          })
      }).toThrow()
    })
    it("fails as expected, all non-match", () => {
      expect(() => {
        con
          .set([
            { rank: "5", suit: "D" },
            { rank: "K", suit: "D" }
          ])
          .each(con => {
            con
              .its("rank")
              .equals("K")
              .its("suit")
              .oneOf(["S", "H"])
          })
      }).toThrow()
    })
  })

  test("player", () => {
    expect(flag(con, "subject")).toBe(state)
    con.player
    expect(flag(con, "subject")).toBe(event.player)
  })
})

describe("nthChild", () => {
  test("valid cases", () => {
    con.get({ name: "parent" }).as("parent")

    // Entities
    expect(() =>
      con
        .get("parent")
        .nthChild(0)
        .equals(bottom)
    ).not.toThrow()
    expect(() =>
      con
        .get("parent")
        .nthChild(2)
        .equals(child)
    ).not.toThrow()
    expect(() =>
      con
        .get("parent")
        .nthChild(4)
        .equals(top)
    ).not.toThrow()

    // Simple array
    expect(() =>
      con
        .set([0, 1, 2, 3])
        .nthChild(0)
        .equals(0)
    ).not.toThrow()
    expect(() =>
      con
        .set([0, 1, 2, 3])
        .nthChild(0)
        .equals(3)
    ).toThrow()
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
  expect(() => con.set("12345").length.equals(5)).not.toThrow()
  expect(() => con.set(["a", "b", "c"]).length.equals(3)).not.toThrow()

  expect(() => con.set(function() {}).length.equals(0)).not.toThrow()
  expect(() => con.set(500).length).toThrow()
})

describe("selection", () => {
  beforeEach(() => {
    let hand = new Hand(state)
    new ClassicCard(state, { parent: hand })
    new ClassicCard(state, { parent: hand })
    new ClassicCard(state, { parent: hand })
    hand.selectChildAt(0)
    hand.selectChildAt(2)
  })
  describe("selectedChildren", () => {
    it("works with proper setup", () => {
      expect(() =>
        con.get({ type: "hand" }).selectedChildren.length.equals(2)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).selectedChildren.length.equals(0)
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
        con.get({ type: "hand" }).unselectedChildren.length.equals(1)
      ).not.toThrow()
      expect(() =>
        con.get({ type: "hand" }).unselectedChildren.length.equals(0)
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

describe("equals", () => {
  test("states properties", () => {
    expect(() => {
      con.state.its("tableWidth").equals(60)
      con.state.its("tableWidth").not.equals("any")
      con.state.its("tableWidth").not.equals(80)
    }).not.toThrow()

    expect(() => {
      con.state.its("tableWidth").equals(80)
    }).toThrow()
  })
})

test("above", () => {
  expect(() => con.set(5).above(0)).not.toThrow()
  expect(() => con.set(-5).above(-10)).not.toThrow()
  expect(() => con.set(0).above(-Infinity)).not.toThrow()
  expect(() => con.set(Infinity).above(-Infinity)).not.toThrow()

  expect(() => con.set(0).above(0)).toThrow()
  expect(() => con.set(0).above(10)).toThrow()

  expect(() => con.set("whoop").above(0)).toThrow()
})
test("below", () => {
  expect(() => con.set(5).below(100)).not.toThrow()
  expect(() => con.set(-10).below(0)).not.toThrow()
  expect(() => con.set(0).below(Infinity)).not.toThrow()
  expect(() => con.set(-Infinity).below(Infinity)).not.toThrow()

  expect(() => con.set(0).below(0)).toThrow()
  expect(() => con.set(0).below(-10)).toThrow()

  expect(() => con.set("whoop").below(0)).toThrow()
})

describe("oneOf", () => {
  beforeEach(() => {
    new SmartEntity(state, { name: "foo" })
  })
  it("passes", () => {
    expect(() =>
      con
        .get({ name: "foo" })
        .its("name")
        .oneOf(["foo", "bar", "baz"])
    ).not.toThrow()

    expect(() =>
      con
        .get({ name: "foo" })
        .its("name")
        .oneOf(["nope", "foo", "bar", "baz"])
    ).not.toThrow()

    expect(() =>
      con
        .get({ name: "foo" })
        .its("name")
        .not.oneOf(["bar", "baz"])
    ).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => {
      con
        .get({ name: "foo" })
        .its("name")
        .oneOf(["bar", "baz"])
    }).toThrow()

    expect(() => {
      con
        .get({ name: "foo" })
        .its("name")
        .not.oneOf(["foo", "bar"])
    }).toThrow()

    expect(() => {
      con
        .get({ name: "foo" })
        .its("name")
        .not.oneOf(["baz", "foo", "bar"])
    }).toThrow()
  })
})

describe("each", () => {
  beforeEach(() => {
    new SmartEntity(state, { parent, name: "childA" })
    new SmartEntity(state, { parent, name: "childB" })
    new SmartEntity(state, { parent, name: "childC" })
  })
  describe("pass", () => {
    // it('tests entities structure', () => {
    //   con.get({ name: "parent" }).as("parent")

    //   // con.get('parent').children.each()
    // })

    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).each(con => {
          con.is.above(3)
        })
      ).not.toThrow()

      expect(() =>
        con.set([15, 10, 5]).each(con => {
          con.is.above(3)
        })
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).each(con => {
          con.is.above(6)
        })
      ).toThrow()

      expect(() =>
        con.set([15, 10, 5]).each(con => {
          con.is.above(6)
        })
      ).toThrow()
    })

    test("incorrect subject", () => {
      expect(() => con.set("whoops").each(con => con.empty)).toThrow(
        /to be an array/
      )
    })
  })
})

describe("empty", () => {
  it("passes", () => {
    expect(() => con.set([]).empty).not.toThrow()
    expect(() => con.set({}).empty).not.toThrow()
    expect(() => con.set("").empty).not.toThrow()
    expect(() => con.set(new Map()).empty).not.toThrow()
    expect(() => con.set(new Set()).empty).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con.set(["foo"]).empty).toThrow()
    expect(() => con.set({ key1: 1 }).empty).toThrow()
    expect(() => con.set("foo").empty).toThrow()
    expect(() => con.set(new Map([["foo", "bar"]])).empty).toThrow()
    expect(() => con.set(new Set(["foo"])).empty).toThrow()
    expect(() => con.set(function foo() {}).empty).toThrow()
    expect(() => con.set(null).empty).toThrow()
  })
})

describe("either", () => {
  describe("pass", () => {
    it("passes on first okay", () => {
      expect(() => {
        con.either(
          () => con.set(1).to.equal(1),
          () => con.set(0).to.equal(1),
          () => con.set(0).to.equal(1)
        )
      }).not.toThrow()
    })

    it("passes on other okay", () => {
      expect(() => {
        con.either(
          () => con.set(0).to.equal(1),
          () => con.set(0).to.equal(1),
          () => con.set(1).to.equal(1)
        )
      }).not.toThrow()
    })
  })
})

describe("flag", () => {
  it("throws with invalid target", () => {
    expect(() => {
      flag({}, "test", "foo")
    }).toThrowError(/Incompatible target/)
  })
})
