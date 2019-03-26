import { State } from "../src/state"
import { Entity } from "../src/entity"

let state: State

describe(`State`, () => {
  test(`creates entities`, () => {
    state = new State()
    expect(state.entities).toBeDefined()
    expect(state.entities instanceof Entity).toBe(true)
    expect(state.entities.id).toBe(0)
    expect(state.entities.length).toBe(0)
    expect(state.entities.parent).toBe(undefined)
    expect(state.entities.owner).toBe(undefined)
  })

  test(`creates proper Root element`, () => {
    state = new State()
  })

  test(`#rememberEntity`, () => {
    state = new State()
    expect(state.entities.id).toBe(0)

    let newID = state.rememberEntity({} as Entity)
    expect(newID).toBe(1)

    newID = state.rememberEntity({} as Entity)
    expect(newID).toBe(2)
  })

  describe(`#getEntity`, () => {
    beforeEach(() => {
      state = new State()
    })

    test(`child of root, by ID`, () => {
      const e = new Entity({ state })
      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of root, by path`, () => {
      const e = new Entity({ state })
      expect(state.getEntity([0])).toBe(e)
    })

    test(`child of parent, by ID`, () => {
      const p = new Entity({ state })
      const e = new Entity({ state, parent: p })
      expect(state.getEntity(e.id)).toBe(e)
    })
    test(`child of parent, by path`, () => {
      const p = new Entity({ state })
      const e = new Entity({ state, parent: p })
      expect(state.getEntity([0, 0])).toBe(e)
    })
    test(`child of fat parent, by path`, () => {
      const p = new Entity({ state })
      new Entity({ state, parent: p })
      const e = new Entity({ state, parent: p })
      new Entity({ state, parent: p })

      expect(state.getEntity([0, 1])).toBe(e)
    })

    test(`deeply nested child, by ID`, () => {
      new Entity({ state })
      const a = new Entity({ state })
      new Entity({ state })

      const b = new Entity({ state, parent: a })
      new Entity({ state, parent: a })
      new Entity({ state, parent: a })

      new Entity({ state, parent: b })
      new Entity({ state, parent: b })
      const c = new Entity({ state, parent: b })

      expect(state.getEntity(b.id)).toBe(b)
      expect(state.getEntity(c.id)).toBe(c)
    })
    test(`deeply nested child, by path`, () => {
      new Entity({ state })
      const a = new Entity({ state })
      new Entity({ state })

      const b = new Entity({ state, parent: a })
      new Entity({ state, parent: a })
      new Entity({ state, parent: a })

      new Entity({ state, parent: b })
      new Entity({ state, parent: b })
      const c = new Entity({ state, parent: b })

      expect(state.getEntity([1, 0])).toBe(b)
      expect(state.getEntity([1, 0, 2])).toBe(c)
    })
  })
})
