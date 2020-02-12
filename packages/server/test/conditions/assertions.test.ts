import { Conditions } from "../../src/conditions/conditions"
import { State } from "../../src/state"
import { ServerPlayerEvent, Player } from "../../src/player"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"
import { SelectableParent } from "../helpers/selectableParent"

let state: State
let event: ServerPlayerEvent
let parent: SmartParent
let selectableParent: SelectableParent
let child: SmartEntity
let top: SmartEntity
let bottom: SmartEntity
let con: Conditions<State>

beforeEach(() => {
  state = new State()
  parent = new SmartParent(state, { name: "parent" })
  selectableParent = new SelectableParent(state, {})

  bottom = new SmartEntity(state, { parent, name: "childTop" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childBottom" })

  new SmartEntity(state, { parent: selectableParent })
  new SmartEntity(state, { parent: selectableParent })
  new SmartEntity(state, { parent: selectableParent })
  new SmartEntity(state, { parent: selectableParent })

  event = {
    player: new Player({ clientID: "123" }),
    entity: top
  }

  con = new Conditions<State>(state, event)
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
test("aboveEq", () => {
  expect(() => con.set(5).aboveEq(0)).not.toThrow()
  expect(() => con.set(5).aboveEq(5)).not.toThrow()
  expect(() => con.set(-5).aboveEq(-10)).not.toThrow()
  expect(() => con.set(-5).aboveEq(-5)).not.toThrow()
  expect(() => con.set(0).aboveEq(-Infinity)).not.toThrow()
  expect(() => con.set(Infinity).aboveEq(-Infinity)).not.toThrow()
  expect(() => con.set(Infinity).aboveEq(Infinity)).not.toThrow()

  expect(() => con.set(0).aboveEq(10)).toThrow()

  expect(() => con.set("whoop").aboveEq(0)).toThrow()
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
test("belowEq", () => {
  expect(() => con.set(5).belowEq(100)).not.toThrow()
  expect(() => con.set(100).belowEq(100)).not.toThrow()
  expect(() => con.set(-10).belowEq(0)).not.toThrow()
  expect(() => con.set(-10).belowEq(-10)).not.toThrow()
  expect(() => con.set(0).belowEq(Infinity)).not.toThrow()
  expect(() => con.set(-Infinity).belowEq(Infinity)).not.toThrow()
  expect(() => con.set(Infinity).belowEq(Infinity)).not.toThrow()

  expect(() => con.set(0).belowEq(-10)).toThrow()

  expect(() => con.set("whoop").belowEq(0)).toThrow()
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

describe("empty", () => {
  it("passes", () => {
    expect(() => con.set([]).empty()).not.toThrow()
    expect(() => con.set({}).empty()).not.toThrow()
    expect(() => con.set("").empty()).not.toThrow()
    expect(() => con.set(new Map()).empty()).not.toThrow()
    expect(() => con.set(new Set()).empty()).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con.set(["foo"]).empty()).toThrow()
    expect(() => con.set({ key1: 1 }).empty()).toThrow()
    expect(() => con.set("foo").empty()).toThrow()
    expect(() => con.set(new Map([["foo", "bar"]])).empty()).toThrow()
    expect(() => con.set(new Set(["foo"])).empty()).toThrow()
    expect(() => con.set(function foo() {}).empty()).toThrow()
    expect(() => con.set(null).empty()).toThrow()
  })
})

describe("selectable", () => {
  it("passes", () => {
    expect(() => con.set(selectableParent).bottom.is.selectable()).not.toThrow()
    expect(() => con.set(selectableParent).top.is.selectable()).not.toThrow()

    expect(() => con.set(parent).top.is.not.selectable()).not.toThrow()
  })
  it("fails as expected", () => {
    expect(() => con.set(selectableParent).top.is.not.selectable()).toThrow()

    expect(() => con.set(parent).bottom.is.selectable()).toThrow()
    expect(() => con.set(parent).top.is.selectable()).toThrow()

    expect(() => con.set(parent).is.selectable()).toThrow()
  })
})

describe("selected", () => {
  it("passes", () => {
    selectableParent.selectChildAt(0)
    expect(() => con.set(selectableParent).bottom.is.selected()).not.toThrow()
    expect(() => con.set(selectableParent).top.is.not.selected()).not.toThrow()

    expect(() => con.set(parent).bottom.is.not.selected()).not.toThrow()
  })
  it("fails as expected", () => {
    selectableParent.selectChildAt(0)
    expect(() => con.set(selectableParent).bottom.is.not.selected()).toThrow()
    expect(() => con.set(selectableParent).top.is.selected()).toThrow()

    expect(() => con.set(parent).bottom.is.selected()).toThrow()
  })
})
