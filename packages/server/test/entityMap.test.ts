import { EntityMap } from "../src/entityMap"
import { IEntity } from "../src/entity"
import { State } from "../src/state"

const state = new State({
  minClients: 1,
  maxClients: 4,
  hostID: "asd"
})

const newEntity = (options = {}, type?: typeof Entity) =>
  new type({ state, ...options })

describe("EntityMap", () => {
  let entityMap: EntityMap

  // beforeEach(() => {
  //   entityMap = new EntityMap()
  // })

  // test("add", () => {
  //   test("returns true", () => {
  //     expect(entityMap.add(newEntity())).toBe(true)
  //   })
  // })
})
