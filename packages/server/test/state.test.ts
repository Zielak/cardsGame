import { State } from "../src/state"
import { DumbParent, DumbEntity } from "./helpers/dumbEntities"

let state: State

describe(`State`, () => {
  test(`creates proper Root element`, () => {
    state = new State()
  })

  test(`#registerEntity`, () => {
    state = new State()

    let newID = state.registerEntity({})
    expect(newID).toBe(0)

    newID = state.registerEntity({})
    expect(newID).toBe(1)
  })

  describe(`#getEntity`, () => {
    beforeEach(() => {
      state = new State()
    })

    test(`child of root, by ID`, () => {
      const e = new DumbEntity(state)
      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of root, by path`, () => {
      const e = new DumbEntity(state)
      expect(state.getEntity([0])).toBe(e)
    })

    test(`child of parent, by ID`, () => {
      const p = new DumbParent(state, {})
      const e = new DumbEntity(state, { parent: p })

      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of parent, by path`, () => {
      const p = new DumbParent(state)
      const e = new DumbEntity(state, { parent: p })
      expect(state.getEntity([0, 0])).toBe(e)
    })
    test(`child of fat parent, by path`, () => {
      const p = new DumbParent(state, {})
      new DumbEntity(state, { parent: p })
      const e = new DumbEntity(state, { parent: p })
      new DumbEntity(state, { parent: p })

      expect(state.getEntity([0, 1])).toBe(e)
    })

    test(`deeply nested child, by ID`, () => {
      new DumbEntity(state)
      const parentA = new DumbParent(state)
      new DumbEntity(state)

      const parentB = new DumbParent(state, { parent: parentA })
      new DumbEntity(state, { parent: parentA })
      new DumbEntity(state, { parent: parentA })

      new DumbEntity(state, { parent: parentB })
      new DumbEntity(state, { parent: parentB })
      const c = new DumbEntity(state, { parent: parentB })

      expect(state.getEntity(parentB.id)).toBe(parentB)
      expect(state.getEntity(c.id)).toBe(c)
    })
    test(`deeply nested child, by path`, () => {
      new DumbEntity(state)
      const a = new DumbParent(state)
      new DumbEntity(state)

      const b = new DumbParent(state, { parent: a })
      new DumbEntity(state, { parent: a })
      new DumbEntity(state, { parent: a })

      new DumbEntity(state, { parent: b })
      new DumbEntity(state, { parent: b })
      const c = new DumbEntity(state, { parent: b })

      expect(state.getEntity([1, 0])).toBe(b)
      expect(state.getEntity([1, 0, 2])).toBe(c)
    })
  })

  test("#clientsCount", () => {
    state = new State()

    expect(state.clientsCount).toBe(0)

    state.clients[0] = "1234"
    state.clients[1] = "qwer"

    expect(state.clientsCount).toBe(2)
  })

  test.todo("#get currentPlayer")
  test.todo("#get playersCount")

  test.todo("#getEntitiesAlongPath")
})
