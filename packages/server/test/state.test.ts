import { State, Entity } from "../index"

let state: State

describe(`State`, () => {
  test(`creates entities`, () => {
    state = new State()
    expect(state.entities).toBeDefined()
  })

  describe(`#getEntity`, () => {
    beforeEach(() => {
      state = new State({
        minClients: 1,
        maxClients: 4,
        hostID: "asd"
      })
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
