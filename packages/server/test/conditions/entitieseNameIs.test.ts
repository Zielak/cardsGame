import { entitiesNameIs } from "../../src/conditions"
import { ConstructedEntity } from "../helpers/dumbEntity"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

test("name checks out", () => {
  const entity = new ConstructedEntity({ state })

  expect(entitiesNameIs("Dummie")(state, { entity })).toBe(true)
})

test("name doesn't check out", () => {
  const entity = new ConstructedEntity({ state })

  expect(entitiesNameIs("whoop")(state, { entity })).toBe(false)
})
