import { State } from "../src/state"
import { EntityConstructor } from "../src/traits/entity"
import { Player } from "../src/player"
import { DumbEntity } from "./helpers/dumbEntity"
import { DumbParent } from "./helpers/dumbParent"
import { getOwner } from "../src/traits/ownership"

let entity: DumbEntity
let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
  entity = new DumbEntity(state)
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
    let parent = new DumbParent({ state })
    let entity = new DumbEntity(state, { parent })

    expect(getParentEntity(entity)).toBe(parent)
  })
  it("gets undefined", () => {
    let entity = new DumbEntity({ state })

    expect(getParentEntity(entity)).toBe(undefined)
  })
})

describe(`setParent`, () => {
  let parent: DumbParent, entity: DumbEntity
  beforeEach(() => {
    parent = new DumbParent({ state })
  })
  test(`adds new child to empty parent`, () => {
    entity = new DumbEntity({ state })
    expect(entity.parent).toBe(-1)

    setParent(entity, parent)
    expect(entity.parent).toBe(parent.id)
  })
  test(`adds new child to parent with children`, () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    entity = new DumbEntity({ state })

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

describe(`getIdxPath`, () => {
  test.todo(`top level entity`)
  test(`nested entities`, () => {
    const parentA = new DumbParent({ state })
    new DumbEntity(state, { parent: parentA })
    new DumbEntity(state, { parent: parentA })

    const parentB = new DumbParent(state, { parent: parentA })

    new DumbEntity(state, { parent: parentA })
    new DumbEntity(state, { parent: parentA })

    new DumbEntity(state, { parent: parentB })
    const child = new DumbEntity(state, { parent: parentB })
    new DumbEntity(state, { parent: parentB })

    expect(getIdxPath(parentA)).toStrictEqual([0])
    expect(getIdxPath(parentB)).toStrictEqual([0, 2])
    expect(getIdxPath(child)).toStrictEqual([0, 2, 1])
  })
})

describe(`isInteractive`, () => {})

describe(`getOwner`, () => {
  let player: Player
  beforeEach(() => {
    player = new Player({ clientID: "myID" })
  })

  test(`entity's direct owner`, () => {
    let parent = new DumbParent({ state })
    let entity = new DumbEntity(state, { owner: player, parent })

    expect(getOwner(state, entity)).toBe(player)
  })
  test(`root entity, no owner`, () => {
    let parent = new DumbParent({ state })
    let entity = new DumbEntity(state, { parent })

    expect(getOwner(state, entity)).toBe(undefined)
  })
  test(`entity parent's owner`, () => {
    let parent = new DumbParent(state, { owner: player })
    let entity = new DumbEntity(state, { parent })

    expect(getOwner(state, entity)).toBe(player)
  })
})

describe(`updateTransform`, () => {})

describe(`resetWorldTransform`, () => {})
