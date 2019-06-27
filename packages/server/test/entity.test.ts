import { State } from "../src/state"
import {
  EntityConstructor,
  getParentEntity,
  getOwner,
  setParent
} from "../src/entities/traits/entity"
import { Player } from "../src/player"
import { DumbEntity, ConstructedEntity } from "./helpers/dumbEntity"
import { ConstructedParent } from "./helpers/dumbParent"

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

  test.todo(".idx")
})

describe(`getParentEntity`, () => {
  it("gets correct parent", () => {
    let parent = new ConstructedParent({ state })
    let entity = new ConstructedEntity({ state, parent })

    expect(getParentEntity(entity)).toBe(parent)
  })
  it("gets undefined", () => {
    let entity = new ConstructedEntity({ state })

    expect(getParentEntity(entity)).toBe(undefined)
  })
})

describe(`setParent`, () => {
  let parent: ConstructedParent, entity: ConstructedEntity
  beforeEach(() => {
    parent = new ConstructedParent({ state })
  })
  test(`adds new child to empty parent`, () => {
    entity = new ConstructedEntity({ state })
    expect(entity.parent).toBe(-1)

    setParent(entity, parent)
    expect(entity.parent).toBe(parent.id)
  })
  test(`adds new child to parent with children`, () => {
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })
    new ConstructedEntity({ state, parent })

    entity = new ConstructedEntity({ state })

    setParent(entity, parent)
    expect(entity.parent).toBe(parent.id)
    expect(parent).toMatchSnapshot()
  })
  test.todo(`makes sure, the entity is removed from it's previous parent`)
  test.todo(`emits "parentUpdate" on child`)
  test.todo(`emits "childAdded" on itself`)

  test.todo(`calls "onChildAdded" on parent`)

  test.todo(`adding entity to itself throws error`)
})

// describe(`getIdxPath`, () => {})

describe(`isInteractive`, () => {})

describe(`getOwner`, () => {
  let player: Player
  beforeEach(() => {
    player = new Player({ state, clientID: "myID" })
  })

  test(`entity's direct owner`, () => {
    let parent = new ConstructedParent({ state })
    let entity = new ConstructedEntity({ state, owner: player, parent })

    expect(getOwner(entity)).toBe(player)
  })
  test(`root entity, no owner`, () => {
    let parent = new ConstructedParent({ state })
    let entity = new ConstructedEntity({ state, parent })

    expect(getOwner(entity)).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    let parent = new ConstructedParent({ state, owner: player })
    let entity = new ConstructedEntity({ state, parent })

    expect(getOwner(entity)).toBe(player)
  })
})

describe(`updateTransform`, () => {})

describe(`resetWorldTransform`, () => {})
