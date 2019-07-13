import { ConstructedParent } from "../helpers/dumbParent"
import { ConstructedEntity } from "../helpers/dumbEntity"
import { State } from "../../src/state"
import { hasChildren } from "../../src/conditions"

let state: State
let parent: ConstructedParent

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })

  parent = new ConstructedParent({ state })
})

describe("picking target parent", () => {
  test("positive", () => {
    new ConstructedEntity({ state, parent })
    expect(hasChildren(parent)(state, {})).toBe(true)
  })
  test("negative", () => {
    expect(hasChildren(parent)(state, {})).toBe(false)
  })
})

describe("checking event's entity", () => {
  test("positive", () => {
    new ConstructedEntity({ state, parent })
    expect(hasChildren(state, { entity: parent })).toBe(true)
  })
  test("negative", () => {
    expect(hasChildren(state, { entity: parent })).toBe(false)
  })
})
