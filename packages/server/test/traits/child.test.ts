import { DumbParent, DumbEntity } from "../helpers/dumbEntities"
import { State } from "../../src/state"

let state: State

beforeEach(() => {
  state = new State()
})

describe(`parent`, () => {
  it("gets correct parent", () => {
    let parent = new DumbParent(state)
    let entity = new DumbEntity(state, { parent })

    expect(entity.parent).toBe(parent)
  })

  it("gets state for root element", () => {
    let entity = new DumbEntity(state)

    expect(entity.parent).toBe(state)
  })
})

describe(`addChild`, () => {
  let parent: DumbParent, entity: DumbEntity
  beforeEach(() => {
    parent = new DumbParent(state)
  })
  test(`adds new child to empty parent`, () => {
    entity = new DumbEntity(state)
    expect(entity.parent).toBe(state)

    parent.addChild(entity)
    expect(entity.parent).toBe(parent)
  })
  test(`adds new child to parent with children`, () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    entity = new DumbEntity(state)

    parent.addChild(entity)
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

    expect(parentA.getIdxPath()).toStrictEqual([0])
    expect(parentB.getIdxPath()).toStrictEqual([0, 2])
    expect(child.getIdxPath()).toStrictEqual([0, 2, 1])
  })
})
