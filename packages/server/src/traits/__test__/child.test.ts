import { DumbParent, DumbEntity } from "../../__test__/helpers/dumbEntities.js"
import { State } from "../../state/state.js"

let state: State

beforeEach(() => {
  state = new State()
})

describe(`parent`, () => {
  let parent: DumbParent, entity: DumbEntity
  it("gets correct parent", () => {
    parent = new DumbParent(state)
    entity = new DumbEntity(state, { parent })

    expect(entity.parent).toBe(parent)
  })

  it("gets state for root element", () => {
    entity = new DumbEntity(state)

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

describe(`idxPath`, () => {
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

    expect(parentA.idxPath).toStrictEqual([0])
    expect(parentB.idxPath).toStrictEqual([0, 2])
    expect(child.idxPath).toStrictEqual([0, 2, 1])
  })
})
