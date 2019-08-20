import { Conditions, getConditionFlag as flag } from "../src/conditions"
import { State } from "../src/state"
import { ServerPlayerEvent, Player } from "../src/player"
import { ConstructedEntity } from "./helpers/dumbEntity"
import { ConstructedParent } from "./helpers/dumbParent"

let state: State
let event: ServerPlayerEvent
let parent: ConstructedParent
let child: ConstructedEntity
let con: Conditions<State>

beforeEach(() => {
  state = new State()
  event = {
    player: new Player({ clientID: "123", state }),
    entity: new ConstructedEntity({ state })
  }
  parent = new ConstructedParent({ state, name: "parent" })
  child = new ConstructedEntity({ state, parent, name: "child" })

  con = new Conditions<State>(state, event)
})

// describe('chainers')

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
    expect(subject.length).toBe(1)
    expect(subject).toContain(child)
  })

  test.todo(
    "checking multiple props" /*, () => {
    con.get("chosenCards").children.each(() => {
      con
        .its("rank")
        .equals("K")
        .its("suit")
        .oneOf(["S", "H"])
    })
  }*/
  )
})

describe("oneOf", () => {
  beforeEach(() => {
    new ConstructedEntity({ state, name: "foo" })
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
    new ConstructedEntity({ state, parent, name: "childA" })
    new ConstructedEntity({ state, parent, name: "childB" })
    new ConstructedEntity({ state, parent, name: "childC" })
  })
  describe("pass", () => {
    // it('tests entities structure', () => {
    //   con.get({ name: "parent" }).as("parent")

    //   // con.get('parent').children.each()
    // })

    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).each(() => {
          con.is.above(3)
        })
      ).not.toThrow()

      expect(() =>
        con.set([15, 10, 5]).each(() => {
          con.is.above(3)
        })
      ).not.toThrow()
    })
  })

  describe("fail", () => {
    it("tests an array", () => {
      expect(() =>
        con.set([5, 10, 15]).each(() => {
          con.is.above(6)
        })
      ).toThrow()

      expect(() =>
        con.set([15, 10, 5]).each(() => {
          con.is.above(6)
        })
      ).toThrow()
    })
  })
})

describe("empty", () => {
  it("passes", () => {
    expect(() => con.set([]).empty).not.toThrow()
    expect(() => con.set("").empty).not.toThrow()
    expect(() => con.set(new Map()).empty).not.toThrow()
    expect(() => con.set(new Set()).empty).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con.set(["foo"]).empty).toThrow()
    expect(() => con.set("foo").empty).toThrow()
    expect(() => con.set(new Map([["foo", "bar"]])).empty).toThrow()
    expect(() => con.set(new Set(["foo"])).empty).toThrow()
    expect(() => con.set(function foo() {}).empty).toThrow()
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
