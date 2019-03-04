import { State } from "../src/state"
import { Entity } from "../src/entity"

describe(`Entity`, () => {
  let entity: Entity
  let state: State

  beforeEach(() => {
    state = new State({
      minClients: 1,
      maxClients: 4,
      hostID: "asd"
    })
  })

  afterEach(() => {
    entity = null
  })

  describe(`#constructor`, () => {
    test(`remembers the state`, () => {
      entity = new Entity({ state })
      expect(entity._state).toBe(state)
    })
    test(`gets new ID from state`, () => {
      entity = new Entity({ state })
      expect(entity.id).toBeDefined()
      expect(entity.id).toBe(state._lastID)
    })

    test(`sets default name and type`, () => {
      entity = new Entity({ state })
      expect(entity.name).toBe(Entity.DEFAULT_NAME)
      expect(entity.type).toBe(Entity.DEFAULT_TYPE)
    })
    test(`sets desired name and type`, () => {
      entity = new Entity({
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
        entity = new Entity({ state })
        expect(entity.parent).toBe(state.entities.id)
      })
      test(`remembers desired parent`, () => {
        const parent = new Entity({ state })
        entity = new Entity({ state, parent })
        expect(entity.parent).toBe(parent.id)
      })
    })
  })
  describe(`sendAllPrivateAttributes`, () => {})
  describe(`sendPrivateAttributeUpdate`, () => {})
  describe(`addChild`, () => {
    test(`adds new child to empty parent`, () => {
      const parent = new Entity({ state })
      entity = new Entity({ state })

      expect(parent.children.length).toBe(0)
      parent.addChild(entity)
      expect(parent.children.length).toBe(1)
    })
    test(`adds new child to parent with children`, () => {})
    test(`emits "parentUpdate" on child`, () => {})
    test(`emits "childAdded" on itself`, () => {})

    test(`adding entity to itself throws error`, () => {
      entity = new Entity({ state })
      expect(() => entity.addChild(entity)).toThrow()
    })
  })
  describe(`addChildAt`, () => {})
  describe(`removeChild`, () => {})
  describe(`removeChildAt`, () => {})

  describe(`restyleChildren`, () => {})
  describe(`restyleChild`, () => {})
  describe(`updateTransform`, () => {})
  describe(`resetWorldTransform`, () => {})

  describe(`filterByName`, () => {})
  describe(`findByName`, () => {})
  describe(`filterByType`, () => {})
  describe(`findByType`, () => {})

  describe(`top/bottom/length`, () => {
    beforeEach(() => {
      entity = new Entity({ state })
      for (let idx = 0; idx < 10; idx++) {
        entity.addChild(new Entity({ state, name: `entity${idx}` }))
      }
    })
    test(`length`, () => {
      expect(entity.length).toBe(10)
    })
    test(`top`, () => {
      expect(entity.length).toBe(10)
    })
  })
  describe(`interactive`, () => {})
  describe(`childrenArray`, () => {})
  describe(`parentEntity`, () => {})
  describe(`currentOwner`, () => {
    // test()
  })
  describe(`idxPath`, () => {})
})
