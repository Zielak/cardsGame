import { Grid } from "../../src/entities/grid"
import { Player, ServerPlayerMessage } from "../../src/players/player"
import { State } from "../../src/state"
import { ConditionsMock } from "../helpers/conditionsMock"
import { SelectableParent } from "../helpers/selectableParent"
import { SmartEntity, SmartParent } from "../helpers/smartEntities"

let state: State
let event: ServerPlayerMessage
let parent: SmartParent
let grid: Grid
let selectableParent: SelectableParent
let child: SmartEntity
let top: SmartEntity
let bottom: SmartEntity
let con: ConditionsMock<State>
let player1: Player
let player2: Player

const UI_KEY1 = "uiKey1"
const UI_KEY2 = "uiKey2"

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

  player1 = new Player({ clientID: "player1" })
  player2 = new Player({ clientID: "player2" })

  state.ui.set(UI_KEY1, player1.clientID)
  state.ui.set(UI_KEY2, "")

  con = new ConditionsMock<State>(state, { example: "foo", player: player1 })
})

describe("equals", () => {
  test("states properties", () => {
    expect(() => {
      con().its("tableWidth").equals(60)
      con().its("tableWidth").not.equals("any")
      con().its("tableWidth").not.equals(80)
    }).not.toThrow()

    expect(() => {
      con().its("tableWidth").equals(80)
    }).toThrow()
  })
})

test("true", () => {
  expect(() => con().set(true).true()).not.toThrow()

  expect(() => con().set(true).not.true()).toThrow(/silly/)
  expect(() => con().set(false).true()).toThrow()
  expect(() => con().set("asd").true()).toThrow()
  expect(() => con().set(1).true()).toThrow()
  expect(() => con().set({}).true()).toThrow()
  expect(() => con().set([]).true()).toThrow()
})

test("false", () => {
  expect(() => con().set(false).false()).not.toThrow()

  expect(() => con().set(false).not.false()).toThrow(/silly/)
  expect(() => con().set(false).false()).toThrow()
  expect(() => con().set("").false()).toThrow()
  expect(() => con().set(0).false()).toThrow()
  expect(() => con().set({}).false()).toThrow()
  expect(() => con().set([]).false()).toThrow()
})

test("defined", () => {
  expect(() => con().set("test").defined()).not.toThrow()
  expect(() => con().set({}).defined()).not.toThrow()
  expect(() => con().set([1, 2]).defined()).not.toThrow()
  expect(() => con().set(null).defined()).not.toThrow()

  expect(() => con().set(undefined).defined()).toThrow()
  expect(() => con().set(undefined).not.defined()).toThrow(/silly/)
})

test("undefined", () => {
  expect(() => con().set("test").undefined()).toThrow()
  expect(() => con().set({}).undefined()).toThrow()
  expect(() => con().set([1, 2]).undefined()).toThrow()
  expect(() => con().set(null).undefined()).toThrow()

  expect(() => con().set(undefined).undefined()).not.toThrow()
  expect(() => con().set(1).not.undefined()).toThrow(/silly/)
})

test("above", () => {
  expect(() => con().set(5).above(0)).not.toThrow()
  expect(() => con().set(-5).above(-10)).not.toThrow()
  expect(() => con().set(0).above(-Infinity)).not.toThrow()
  expect(() => con().set(Infinity).above(-Infinity)).not.toThrow()

  expect(() => con().set(0).above(0)).toThrow()
  expect(() => con().set(0).above(10)).toThrow()

  expect(() => con().set("whoop").above(0)).toThrow()
})
test("aboveEq", () => {
  expect(() => con().set(5).aboveEq(0)).not.toThrow()
  expect(() => con().set(5).aboveEq(5)).not.toThrow()
  expect(() => con().set(-5).aboveEq(-10)).not.toThrow()
  expect(() => con().set(-5).aboveEq(-5)).not.toThrow()
  expect(() => con().set(0).aboveEq(-Infinity)).not.toThrow()
  expect(() => con().set(Infinity).aboveEq(-Infinity)).not.toThrow()
  expect(() => con().set(Infinity).aboveEq(Infinity)).not.toThrow()

  expect(() => con().set(0).aboveEq(10)).toThrow()

  expect(() => con().set("whoop").aboveEq(0)).toThrow()
})
test("below", () => {
  expect(() => con().set(5).below(100)).not.toThrow()
  expect(() => con().set(-10).below(0)).not.toThrow()
  expect(() => con().set(0).below(Infinity)).not.toThrow()
  expect(() => con().set(-Infinity).below(Infinity)).not.toThrow()

  expect(() => con().set(0).below(0)).toThrow()
  expect(() => con().set(0).below(-10)).toThrow()

  expect(() => con().set("whoop").below(0)).toThrow()
})
test("belowEq", () => {
  expect(() => con().set(5).belowEq(100)).not.toThrow()
  expect(() => con().set(100).belowEq(100)).not.toThrow()
  expect(() => con().set(-10).belowEq(0)).not.toThrow()
  expect(() => con().set(-10).belowEq(-10)).not.toThrow()
  expect(() => con().set(0).belowEq(Infinity)).not.toThrow()
  expect(() => con().set(-Infinity).belowEq(Infinity)).not.toThrow()
  expect(() => con().set(Infinity).belowEq(Infinity)).not.toThrow()

  expect(() => con().set(0).belowEq(-10)).toThrow()

  expect(() => con().set("whoop").belowEq(0)).toThrow()
})

describe("oneOf", () => {
  beforeEach(() => {
    new SmartEntity(state, { name: "foo" })
  })
  it("passes", () => {
    expect(() =>
      con().set({ name: "foo" }).its("name").oneOf(["foo", "bar", "baz"])
    ).not.toThrow()

    expect(() =>
      con()
        .set({ name: "foo" })
        .its("name")
        .oneOf(["nope", "foo", "bar", "baz"])
    ).not.toThrow()

    expect(() =>
      con().set({ name: "foo" }).its("name").not.oneOf(["bar", "baz"])
    ).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => {
      con({ name: "foo" }).its("name").oneOf(["bar", "baz"])
    }).toThrow()

    expect(() => {
      con({ name: "foo" }).its("name").not.oneOf(["foo", "bar"])
    }).toThrow()

    expect(() => {
      con({ name: "foo" }).its("name").not.oneOf(["baz", "foo", "bar"])
    }).toThrow()
  })
})

describe("empty", () => {
  it("passes", () => {
    expect(() => con().set([]).empty()).not.toThrow()
    expect(() => con().set({}).empty()).not.toThrow()
    expect(() => con().set("").empty()).not.toThrow()
    expect(() => con().set(new Map()).empty()).not.toThrow()
    expect(() => con().set(new Set()).empty()).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con().set(["foo"]).empty()).toThrow()
    expect(() => con().set({ key1: 1 }).empty()).toThrow()
    expect(() => con().set("foo").empty()).toThrow()
    expect(() =>
      con()
        .set(new Map([["foo", "bar"]]))
        .empty()
    ).toThrow()
    expect(() =>
      con()
        .set(new Set(["foo"]))
        .empty()
    ).toThrow()
    expect(() =>
      con()
        .set(function foo() {})
        .empty()
    ).toThrow()
    expect(() => con().set(null).empty()).toThrow()
  })
})

describe("full", () => {
  beforeEach(() => {
    grid = new Grid(state, {
      columns: 2,
      rows: 2,
    })
  })

  test("grid full", () => {
    new SmartEntity(state, { parent: grid })
    new SmartEntity(state, { parent: grid })
    new SmartEntity(state, { parent: grid })
    new SmartEntity(state, { parent: grid })

    expect(() => con().set(grid).full()).not.toThrow()
    expect(() => con().set(grid).not.full()).toThrow()
  })

  test("grid half-full", () => {
    new SmartEntity(state, { parent: grid })
    new SmartEntity(state, { parent: grid })

    expect(() => con().set(grid).full()).toThrow()
    expect(() => con().set(grid).not.full()).not.toThrow()
  })

  test("grid empty", () => {
    expect(() => con().set(grid).full()).toThrow()
    expect(() => con().set(grid).not.full()).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con().set(["foo"]).full()).toThrow()
    expect(() => con().set({ key1: 1 }).full()).toThrow()
    expect(() => con().set("foo").full()).toThrow()
    expect(() =>
      con()
        .set(new Map([["foo", "bar"]]))
        .full()
    ).toThrow()
    expect(() =>
      con()
        .set(new Set(["foo"]))
        .full()
    ).toThrow()
    expect(() =>
      con()
        .set(function foo() {})
        .full()
    ).toThrow()
    expect(() => con().set(null).full()).toThrow()
  })
})

describe("selectable", () => {
  it("passes", () => {
    expect(() =>
      con().set(selectableParent).bottom.is.selectable()
    ).not.toThrow()
    expect(() => con().set(selectableParent).top.is.selectable()).not.toThrow()

    expect(() => con().set(parent).top.is.not.selectable()).not.toThrow()
  })

  it("fails as expected", () => {
    expect(() => con().set(selectableParent).top.is.not.selectable()).toThrow()

    expect(() => con().set(parent).bottom.is.selectable()).toThrow()
    expect(() => con().set(parent).top.is.selectable()).toThrow()

    expect(() => con().set(parent).is.selectable()).toThrow()

    expect(() => con().set({}).is.selectable()).toThrow()
    expect(() => con().set(1).is.selectable()).toThrow()
  })
})

describe("selected", () => {
  it("passes", () => {
    selectableParent.selectChildAt(0)
    expect(() => con().set(selectableParent).bottom.is.selected()).not.toThrow()
    expect(() =>
      con().set(selectableParent).top.is.not.selected()
    ).not.toThrow()

    expect(() => con().set(parent).bottom.is.not.selected()).not.toThrow()
  })
  it("fails as expected", () => {
    selectableParent.selectChildAt(0)
    expect(() => con().set(selectableParent).bottom.is.not.selected()).toThrow()
    expect(() => con().set(selectableParent).top.is.selected()).toThrow()

    expect(() => con().set(parent).bottom.is.selected()).toThrow()

    expect(() => con().set({}).is.selected()).toThrow()
    expect(() => con().set(1).is.selected()).toThrow()
  })
})

test("matchesPropOf", () => {
  con().set(bottom).as("bottom")
  con().set(top).as("top")

  expect(() => con("bottom").its("type").matchesPropOf("top")).not.toThrow()
  expect(() => con("top").its("type").matchesPropOf("bottom")).not.toThrow()

  expect(() => con().set(top).matchesPropOf("bottom")).toThrow()
  expect(() => con().set([]).matchesPropOf("bottom")).toThrow()
})

describe("revealedUI", () => {
  test("passes", () => {
    // player1
    expect(() => con().revealedUI()).not.toThrow()
    expect(() => con().revealedUI(UI_KEY1)).not.toThrow()
    expect(() => con().has.not.revealedUI(UI_KEY2)).not.toThrow()

    expect(() => con().revealedUI(UI_KEY2)).toThrow("client doesn't have")

    // player2
    con = new ConditionsMock<State>(state, { example: "foo", player: player2 })

    expect(() => con().has.not.revealedUI()).not.toThrow()
    expect(() => con().has.not.revealedUI(UI_KEY1)).not.toThrow()
    expect(() => con().has.not.revealedUI(UI_KEY2)).not.toThrow()

    expect(() => con().revealedUI()).toThrow()
    expect(() => con().revealedUI(UI_KEY1)).toThrow()
    expect(() => con().revealedUI(UI_KEY2)).toThrow()
  })
})

test("itsPlayersTurn", () => {
  state.players[0] = player1
  state.players[1] = player2

  state.currentPlayerIdx = 0
  expect(() => con().itsPlayersTurn()).not.toThrow()

  state.currentPlayerIdx = 1
  expect(() => con().itsPlayersTurn()).toThrow()
})
