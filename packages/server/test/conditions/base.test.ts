import { State } from "src/state"

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

  bottom = new SmartEntity(state, { parent, name: "childBottom" })
  new SmartEntity(state, { parent, name: "child" })
  child = new SmartEntity(state, { parent, name: "child" })
  new SmartEntity(state, { parent, name: "child" })
  top = new SmartEntity(state, { parent, name: "childTop" })

  con = new ConditionsMock(state, { example: "foo" })
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
