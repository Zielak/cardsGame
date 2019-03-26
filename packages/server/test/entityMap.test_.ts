import { EntityMap } from "../src/entityMap"
import { Entity } from "../src/entity"
import { State } from "../src/state"

const state = new State({
  minClients: 1,
  maxClients: 4,
  hostID: "asd"
})

const newEntity = (options = {}) => new Entity({ state, ...options })

describe("EntityMap<string>", () => {
  let map: EntityMap<string>

  beforeEach(() => {
    map = new EntityMap<string>()
  })

  test("toArray", () => {
    expect(Array.isArray(map.toArray())).toBeTruthy()
    expect(map.toArray().length).toBe(0)
    map.add("test")
    expect(map.toArray().length).toBe(1)
    map.add("test2")
    expect(map.toArray().length).toBe(2)
  })
})

describe("EntityMap<Entity>", () => {
  let map: EntityMap<Entity>

  beforeEach(() => {
    map = new EntityMap<Entity>()
  })

  test("toArray", () => {
    expect(Array.isArray(map.toArray())).toBeTruthy()
    expect(map.toArray().length).toBe(0)
    map.add(newEntity())
    expect(map.toArray().length).toBe(1)
    map.add(newEntity())
    expect(map.toArray().length).toBe(2)
  })
})

describe("static", () => {
  test.todo("byName")
  test.todo("byType")
  test.todo("sortByIdx")
})
