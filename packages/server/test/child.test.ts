import { DumbParent, DumbEntity } from "./helpers/dumbEntities"
import { State } from "../src/state"
import { getParentEntity, setParent, getIdxPath } from "../src/traits/child"

let state: State

beforeEach(() => {
  state = new State({
    minClients: 1,
    maxClients: 4,
    hostID: "asd"
  })
})

describe(`getParentEntity`, () => {
  it("gets correct parent", () => {
    let parent = new DumbParent(state)
    let entity = new DumbEntity(state, { parent })

    expect(getParentEntity(state, entity)).toBe(parent)
  })

  it("gets state for root element", () => {
    let entity = new DumbEntity(state)

    expect(getParentEntity(state, entity)).toBe(state)
  })
})

describe(`setParent`, () => {
  let parent: DumbParent, entity: DumbEntity
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  test(`adds new child to empty parent`, () => {
    entity = new DumbEntity(state)
    expect(entity.parent).toBe(state)

    setParent(state, entity, parent)
    expect(entity.parent).toBe(parent)
  })
  test(`adds new child to parent with children`, () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    entity = new DumbEntity(state)

    setParent(state, entity, parent)
    expect(entity.parent).toBe(parent)
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
    const parentA = new DumbParent(state)
    new DumbEntity(state, { parent: parentA })
    new DumbEntity(state, { parent: parentA })

    const parentB = new DumbParent(state, { parent: parentA })

    new DumbEntity(state, { parent: parentA })
    new DumbEntity(state, { parent: parentA })

    new DumbEntity(state, { parent: parentB })
    const child = new DumbEntity(state, { parent: parentB })
    new DumbEntity(state, { parent: parentB })

    expect(getIdxPath(state, parentA)).toStrictEqual([0])
    expect(getIdxPath(state, parentB)).toStrictEqual([0, 2])
    expect(getIdxPath(state, child)).toStrictEqual([0, 2, 1])
  })
})
