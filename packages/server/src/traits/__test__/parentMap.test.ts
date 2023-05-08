import { DumbEntity, DumbParent } from "../../__test__/helpers/dumbEntities.js"
import { LabeledEntity } from "../../__test__/helpers/labeledEntities.js"
import { State } from "../../state/state.js"
import type { ChildTrait } from "../child.js"
import type { IdentityTrait } from "../identity.js"
import { errors } from "../parent/errors.js"

let state: State
const OPTIONS: Partial<DumbParent> = { collectionBehaviour: "map" }

beforeEach(() => {
  state = new State()
})

describe("ParentConstructor", () => {
  test("sets default properties", () => {
    const parent = new DumbParent(state, OPTIONS)

    expect(parent.countChildren()).toBe(0)
    expect(parent.hijacksInteractionTarget).toBe(false)
    expect(parent.maxChildren).toBe(Infinity)
  })
  test("remembers custom values", () => {
    const parent = new DumbParent(state, { ...OPTIONS, maxChildren: 3 })

    expect(parent.maxChildren).toBe(3)
  })
})

describe("#removeChildAt", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state, OPTIONS)
  })
  it(`throws on invalid "idx"`, () => {
    expect(parent.removeChildAt(-2)).toBe(false)
    expect(parent.removeChildAt(NaN)).toBe(false)
    expect(parent.removeChildAt(Infinity)).toBe(false)
    expect(parent.removeChildAt(10)).toBe(false)
  })
  it("removes the only child", () => {
    new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChildAt(0)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })
  it("removes child in the middle", () => {
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(3)
    expect(parent.removeChildAt(1)).toBe(true)
    expect(parent.countChildren()).toBe(2)
  })
})

describe("#removeChild", () => {
  let parent: DumbParent
  it("calls removeChildAt", () => {
    parent = new DumbParent(state, OPTIONS)
    const entity = new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChild(entity)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })

  it("finds proper child", () => {
    parent = new DumbParent(state, OPTIONS)
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    parent.removeChild(entity)
    expect(
      parent.getChildren().map((e: ChildTrait & IdentityTrait) => e.id)
    ).toMatchSnapshot()
  })

  it("returns false for not its child", () => {
    const child = new DumbEntity(state)

    expect(parent.removeChild(child)).toBe(false)
  })
})

describe("#addChild", () => {
  let parent: DumbParent
  let entity: DumbEntity
  beforeEach(() => {
    parent = new DumbParent(state, { ...OPTIONS, maxChildren: 5 })
    new DumbEntity(state, { parent })
  })
  it("adds new item", () => {
    entity = new DumbEntity(state)
    parent.addChild(entity)

    expect(entity.parent).toBe(parent)
    expect(entity.idx).toBe(1)
    expect(parent.countChildren()).toBe(2)
  })
  it("prepends new item", () => {
    entity = new DumbEntity(state)
    parent.addChild(entity, true)

    expect(entity.parent).toBe(parent)
    expect(entity.idx).toBe(0)
    expect(parent.countChildren()).toBe(2)
  })
  it("prepends in busier parent", () => {
    // Clean parent this time.
    parent = new DumbParent(state, OPTIONS)
    const e0 = new LabeledEntity(state, { parent, name: "e0", idx: 0 })
    const e1 = new LabeledEntity(state, { parent, name: "e1", idx: 1 })
    const e3 = new LabeledEntity(state, { parent, name: "e3", idx: 3 })
    entity = new DumbEntity(state)

    expect(parent.getChildren().map((c) => c.idx)).toStrictEqual([0, 1, 3])
    expect(e0.idx).toBe(0)
    expect(e1.idx).toBe(1)
    expect(e3.idx).toBe(3)

    parent.addChild(entity, true)

    expect(entity.parent).toBe(parent)
    expect(parent.getChildren().map((c) => c.idx)).toStrictEqual([0, 1, 2, 3])

    expect(entity.idx).toBe(0)
    expect(e0.idx).toBe(1)
    expect(e1.idx).toBe(2)
    expect(e3.idx).toBe(3)

    expect(parent.countChildren()).toBe(4)
  })
  it("throws at out of bounds index", () => {
    expect(() => parent.addChild(new DumbEntity(state), 10)).toThrow()
  })
  it("add item at index", () => {
    const entityA = new DumbEntity(state)
    const entityB = new DumbEntity(state)

    // index 0 is already set at beforeEach()
    expect(() => parent.addChild(entityA, 0)).toThrow()

    parent.addChild(entityA, 3)

    expect(entityA.parent).toBe(parent)
    expect(entityA.idx).toBe(3)
    expect(parent.countChildren()).toBe(2)

    parent.addChild(entityB, 4)

    expect(entityB.parent).toBe(parent)
    expect(entityB.idx).toBe(4)
    expect(parent.countChildren()).toBe(3)
  })
  it("throws at full parent", () => {
    parent = new DumbParent(state, { ...OPTIONS, maxChildren: 1 })

    new DumbEntity(state, { parent })

    expect(() => parent.addChild(new DumbEntity(state))).toThrow(
      errors.ADDCHILD_NO_EMPTY_SPOTS()
    )
  })
})

describe("#moveChildTo", () => {
  const mapChildren = (parent: DumbParent): any[] => {
    const max =
      parent.maxChildren !== Infinity
        ? parent.maxChildren
        : parent.countChildren()

    const results = []
    for (let i = 0; i < max; i++) {
      const child = parent.getChild<DumbEntity>(i)
      results.push(child ? child.id : null)
    }
    return results
  }

  let parent: DumbParent

  describe("filled", () => {
    beforeEach(() => {
      parent = new DumbParent(state, { ...OPTIONS, maxChildren: 5 })
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })
    })
    it("moves item3 down 1 position", () => {
      parent.moveChildTo(2, 1)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item3 up 1 position", () => {
      parent.moveChildTo(2, 3)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item3 to bottom", () => {
      parent.moveChildTo(2, 0)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item3 to top", () => {
      parent.moveChildTo(2, parent.countChildren() - 1)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("doesn't move anything (item3 to same position)", () => {
      parent.moveChildTo(2, 2)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("throws on indexes out of boundaries", () => {
      expect(() => parent.moveChildTo(2, 10)).toThrow()
      expect(() => parent.moveChildTo(10, 2)).toThrow()
      expect(() => parent.moveChildTo(-2, 0)).toThrow()
      expect(() => parent.moveChildTo(0, -1)).toThrow()

      expect(mapChildren(parent)).toMatchSnapshot()
    })
  })

  describe("with empty spaces", () => {
    beforeEach(() => {
      parent = new DumbParent(state, { ...OPTIONS, maxChildren: 5 })
      new DumbEntity(state, { parent, idx: 2 })
    })
    it("moves item down 1 position", () => {
      parent.moveChildTo(2, 1)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item up 1 position", () => {
      parent.moveChildTo(2, 3)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item to bottom", () => {
      parent.moveChildTo(2, 0)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("moves item to top", () => {
      parent.moveChildTo(2, parent.maxChildren - 1)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("doesn't move anything (item to same position)", () => {
      parent.moveChildTo(2, 2)
      expect(mapChildren(parent)).toMatchSnapshot()
    })
    it("throws on indexes out of boundaries", () => {
      expect(() => parent.moveChildTo(2, 10)).toThrow()
      expect(() => parent.moveChildTo(10, 2)).toThrow()
      expect(() => parent.moveChildTo(-2, 0)).toThrow()
      expect(() => parent.moveChildTo(0, -2)).toThrow()

      expect(mapChildren(parent)).toMatchSnapshot()
    })
  })
})

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state, OPTIONS)
  })
  test("empty parent", () => {
    expect(parent.getChildren()).toMatchSnapshot()
  })
  test("couple of children", () => {
    const first = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    const last = new DumbEntity(state, { parent })

    const result = parent.getChildren()
    expect(result).toMatchSnapshot()
    expect(result[0]).toBe(first)
    expect(result[result.length - 1]).toBe(last)
  })
})

describe("#getChild", () => {
  let parent
  let entity

  it("gets child", () => {
    parent = new DumbParent(state, OPTIONS)

    new DumbEntity(state, { parent })
    entity = new DumbEntity(state, { parent })

    expect(parent.getChild(1)).toBe(entity)
  })
  test("idx out of range", () => {
    parent = new DumbParent(state, OPTIONS)

    expect(parent.getChild(-1)).toBeUndefined()
    expect(parent.getChild(0)).toBeUndefined()
    expect(parent.getChild(Infinity)).toBeUndefined()
  })
  test("idx out of range in limited container", () => {
    parent = new DumbParent(state, { ...OPTIONS, maxChildren: 5 })

    expect(parent.getChild(-1)).toBeUndefined()
    expect(parent.getChild(10)).toBeUndefined()
    expect(parent.getChild(-Infinity)).toBeUndefined()
    expect(parent.getChild(Infinity)).toBeUndefined()
  })
})

test("#getTop", () => {
  const parent = new DumbParent(state, OPTIONS)
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  const entity = new DumbEntity(state, { parent })

  expect(parent.getTop()).toBe(entity)
})

test("#getBottom", () => {
  const parent = new DumbParent(state, OPTIONS)
  const entity = new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })

  expect(parent.getBottom()).toBe(entity)
})

describe("#getFirstEmptySpot", () => {
  let parent: DumbParent
  describe("limited parent", () => {
    beforeEach(() => {
      parent = new DumbParent(state, { ...OPTIONS, maxChildren: 3 })
    })
    it("returns zero on empty parent", () => {
      expect(parent.getFirstEmptySpot()).toBe(0)
    })
    it("return zero", () => {
      new DumbEntity(state, { parent, idx: 1 })
      new DumbEntity(state, { parent, idx: 2 })

      expect(parent.getFirstEmptySpot()).toBe(0)
    })
    it("return one", () => {
      new DumbEntity(state, { parent, idx: 0 })
      new DumbEntity(state, { parent, idx: 2 })

      expect(parent.getFirstEmptySpot()).toBe(1)
    })
    it("return last", () => {
      new DumbEntity(state, { parent, idx: 0 })
      new DumbEntity(state, { parent, idx: 1 })

      expect(parent.getFirstEmptySpot()).toBe(2)
    })
    it("can't find it so it returns -1", () => {
      new DumbEntity(state, { parent, idx: 0 })
      new DumbEntity(state, { parent, idx: 1 })
      new DumbEntity(state, { parent, idx: 2 })

      expect(parent.getFirstEmptySpot()).toBe(-1)
    })
  })
  describe("unlimited parent", () => {
    beforeEach(() => {
      parent = new DumbParent(state, OPTIONS)
    })
    it("returns zero on empty parent", () => {
      expect(parent.getFirstEmptySpot()).toBe(0)
    })
    it("return zero", () => {
      new DumbEntity(state, { parent, idx: 1 })
      new DumbEntity(state, { parent, idx: 2 })

      expect(parent.getFirstEmptySpot()).toBe(0)
    })
    it("return one", () => {
      new DumbEntity(state, { parent, idx: 0 })
      new DumbEntity(state, { parent, idx: 2 })

      expect(parent.getFirstEmptySpot()).toBe(1)
    })
    it("return last", () => {
      new DumbEntity(state, { parent, idx: 0 })
      new DumbEntity(state, { parent, idx: 1 })

      expect(parent.getFirstEmptySpot()).toBe(2)
    })
  })
})

describe("#getLastEmptySpot", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state, { ...OPTIONS, maxChildren: 5 })
  })
  it("picks last on empty parent", () => {
    expect(parent.getLastEmptySpot()).toBe(4)
  })
  it("picks last spot", () => {
    // 0
    new DumbEntity(state, { parent, idx: 1 })
    new DumbEntity(state, { parent, idx: 2 })
    // 3
    // 4

    expect(parent.getLastEmptySpot()).toBe(4)
  })
  it("picks 3 from 2 empty spaces", () => {
    // 0
    new DumbEntity(state, { parent, idx: 1 })
    new DumbEntity(state, { parent, idx: 2 })
    // 3
    new DumbEntity(state, { parent, idx: 4 })

    expect(parent.getLastEmptySpot()).toBe(3)
  })
  it("picks 2 from 2 empty spaces", () => {
    new DumbEntity(state, { parent, idx: 0 })
    // 1
    // 2
    new DumbEntity(state, { parent, idx: 3 })
    new DumbEntity(state, { parent, idx: 4 })

    expect(parent.getLastEmptySpot()).toBe(2)
  })
  it("returns -1, for filled container", () => {
    new DumbEntity(state, { parent, idx: 0 })
    new DumbEntity(state, { parent, idx: 1 })
    new DumbEntity(state, { parent, idx: 2 })
    new DumbEntity(state, { parent, idx: 3 })
    new DumbEntity(state, { parent, idx: 4 })

    expect(parent.getLastEmptySpot()).toBe(-1)
  })
})
