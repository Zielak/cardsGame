import {
  SmartEntity,
  SmartParent,
} from "../../__test__/helpers/smartEntities.js"
import { State } from "../../state/state.js"

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

  bottom = new SmartEntity(state, { parent, name: "childBottom" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childTop" })

  con = new ConditionsTest(state, { example: "foo" })
})

describe("grab", () => {
  it("grabs current subject whatever it is", () => {
    expect(con().grab()).toBe(state)
    expect(con().set(parent).grab()).toBe(parent)
    expect(con().set("hello").grab()).toBe("hello")
  })

  it("grabs by refName", () => {
    con().remember("parent", { name: "parent" })
    expect(con().grab("parent")).toBe(parent)

    con().query({ name: "childTop" }).as("top")
    expect(con().grab("top")).toBe(top)
  })
})

describe("grabState", () => {
  it("grabs state", () => {
    expect(con().grabState()).toBe(state)
  })
  it("still grabs it on different current subject", () => {
    expect(con().set("nope").grabState()).toBe(state)
  })
})
