import { State } from "../src/state"
import { EntityConstructor } from "../src/entities"
import { DumbEntity } from "./helpers/dumbEntity"

let entity: DumbEntity
let state: State

beforeEach(() => {
  entity = new DumbEntity()
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe(`EntityConstructor`, () => {
  test(`doesn't throw up`, () => {
    expect(() => EntityConstructor(entity, { state })).not.toThrow()
  })
  test(`remembers the state`, () => {
    EntityConstructor(entity, { state })
    expect(entity._state).toBe(state)
  })
  test(`gets new ID from state`, () => {
    EntityConstructor(entity, { state })
    expect(entity.id).toBeDefined()
    expect(entity.id).toBe(state._lastID)
  })
  test(`sets desired name and type`, () => {
    EntityConstructor(entity, {
      state,
      name: "beautiful",
      type: "almostEntity"
    })
    expect(entity.name).toBe("beautiful")
    expect(entity.type).toBe("almostEntity")
  })

  describe(`.parent`, () => {
    // Parent should never be `null`!
    test(`default - state's entites`, () => {
      EntityConstructor(entity, { state })
      expect(entity.parent).toBe(state.id)
    })
    test.todo('should throw if given "parent" is not really a IParent')
  })
})
describe(`getParentEntity`, () => {})
describe.skip(`setParent`, () => {
  test.todo(`adds new child to empty parent`)
  test.todo(`adds new child to parent with children`)
  test.todo(`emits "parentUpdate" on child`)
  test.todo(`emits "childAdded" on itself`)

  test.todo(`adding entity to itself throws error`)
})
describe(`getIdxPath`, () => {})
describe(`isInteractive`, () => {})
describe(`getOwner`, () => {})

describe(`updateTransform`, () => {})
describe(`resetWorldTransform`, () => {})
