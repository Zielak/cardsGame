import { State } from "../src/state"
import { IEntity } from "../src/entities"
import { ConstructedEntity } from "./helpers/dumbEntity"
import { ConstructedParent } from "./helpers/dumbParent"

let state: State

describe(`State`, () => {
  test(`creates proper Root element`, () => {
    state = new State()
  })

  test(`#registerEntity`, () => {
    state = new State()

    let newID = state.registerEntity({} as IEntity)
    expect(newID).toBe(0)

    newID = state.registerEntity({} as IEntity)
    expect(newID).toBe(1)
  })

  describe(`#getEntity`, () => {
    beforeEach(() => {
      state = new State()
    })

    test(`child of root, by ID`, () => {
      const e = new ConstructedEntity({ state })
      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of root, by path`, () => {
      const e = new ConstructedEntity({ state })
      expect(state.getEntity([0])).toBe(e)
    })

    test(`child of parent, by ID`, () => {
      const p = new ConstructedParent({ state })
      const e = new ConstructedEntity({ state, parent: p })
      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of parent, by path`, () => {
      const p = new ConstructedParent({ state })
      const e = new ConstructedEntity({ state, parent: p })
      expect(state.getEntity([0, 0])).toBe(e)
    })
    test(`child of fat parent, by path`, () => {
      const p = new ConstructedParent({ state })
      new ConstructedEntity({ state, parent: p })
      const e = new ConstructedEntity({ state, parent: p })
      new ConstructedEntity({ state, parent: p })

      expect(state.getEntity([0, 1])).toBe(e)
    })

    test(`deeply nested child, by ID`, () => {
      new ConstructedEntity({ state })
      const parentA = new ConstructedParent({ state })
      new ConstructedEntity({ state })

      const parentB = new ConstructedParent({ state, parent: parentA })
      new ConstructedEntity({ state, parent: parentA })
      new ConstructedEntity({ state, parent: parentA })

      new ConstructedEntity({ state, parent: parentB })
      new ConstructedEntity({ state, parent: parentB })
      const c = new ConstructedEntity({ state, parent: parentB })

      expect(state.getEntity(parentB.id)).toBe(parentB)
      expect(state.getEntity(c.id)).toBe(c)
    })
    test(`deeply nested child, by path`, () => {
      new ConstructedEntity({ state })
      const a = new ConstructedParent({ state })
      new ConstructedEntity({ state })

      const b = new ConstructedParent({ state, parent: a })
      new ConstructedEntity({ state, parent: a })
      new ConstructedEntity({ state, parent: a })

      new ConstructedEntity({ state, parent: b })
      new ConstructedEntity({ state, parent: b })
      const c = new ConstructedEntity({ state, parent: b })

      expect(state.getEntity([1, 0])).toBe(b)
      expect(state.getEntity([1, 0, 2])).toBe(c)
    })
  })

  test.todo("#get currentPlayer")
  test.todo("#get playersCount")

  test.todo("#getEntitiesAlongPath")
})
