import { State } from "src/state"
import type { ChildTrait } from "src/traits/child"
import type { IdentityTrait } from "src/traits/identity"

import { DumbEntity, DumbParent } from "../helpers/dumbEntities"

let state: State

beforeEach(() => {
  state = new State()
})

describe("ParentConstructor", () => {
  test("sets default properties", () => {
    const parent = new DumbParent(state)

    expect(parent.countChildren()).toBe(0)

    expect(parent.hijacksInteractionTarget).toBeDefined()
    expect(parent.hijacksInteractionTarget).toBe(true)
  })
})

describe("#removeChildAt", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state)
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
  it("returns false for not its child", () => {
    const child = new DumbEntity(state)

    expect(parent.removeChild(child)).toBe(false)
  })
})

describe("#removeChild", () => {
  let parent: DumbParent
  it("calls removeChildAt", () => {
    parent = new DumbParent(state)
    const entity = new DumbEntity(state, { parent })

    expect(parent.countChildren()).toBe(1)
    expect(parent.removeChild(entity)).toBe(true)
    expect(parent.countChildren()).toBe(0)
  })

  it("finds proper child", () => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })

    parent.removeChild(entity)
    expect(
      parent.getChildren().map((e: ChildTrait & IdentityTrait) => e.id)
    ).toMatchSnapshot()
  })
})

describe("#addChild", () => {
  let parent: DumbParent
  let entity: DumbEntity
  beforeEach(() => {
    parent = new DumbParent(state)
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
  it("add item at index", () => {
    const entityA = new DumbEntity(state)
    const entityB = new DumbEntity(state)

    parent.addChild(entityA, 0)

    expect(entityA.parent).toBe(parent)
    expect(entityA.idx).toBe(0)
    expect(parent.countChildren()).toBe(2)

    parent.addChild(entityB, 1)

    expect(entityB.parent).toBe(parent)
    expect(entityB.idx).toBe(1)
    expect(entityA.idx).toBe(0)
    expect(parent.countChildren()).toBe(3)
  })
  it("throws on incorrect indexes", () => {
    const e = new DumbEntity(state)
    expect(() => parent.addChild(e, -1)).toThrow()
  })
  it("throws on empty argument", () => {
    expect(() => {
      // @ts-expect-error: testing empty argumentgetChild
      parent.addChild()
    }).toThrow(`missing required argument "entity"`)
  })
})

describe("#moveChildTo", () => {
  const mapArrayChildren = (p): any =>
    p.getChildren().map((e) => (e ? e.id : null))

  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
  })
  it("moves item3 down 1 position", () => {
    parent.moveChildTo(2, 1)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 up 1 position", () => {
    parent.moveChildTo(2, 3)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 to bottom", () => {
    parent.moveChildTo(2, 0)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("moves item3 to top", () => {
    parent.moveChildTo(2, parent.countChildren() - 1)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("doesn't move anything (item3 to same position)", () => {
    parent.moveChildTo(2, 2)
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })
  it("handles too high 'to' number, treats as max value", () => {
    expect(() => parent.moveChildTo(2, 10)).not.toThrow()
    expect(mapArrayChildren(parent)).toMatchSnapshot()
  })

  it("throws on out of range idx", () => {
    expect(() => parent.moveChildTo(-2, 3)).toThrow()
  })
})

test.todo("#countChildren")
describe("#getChildren", () => {
  let parent: DumbParent
  beforeEach(() => {
    parent = new DumbParent(state)
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
  it("doesn't return direct reference", () => {
    expect(parent.getChildren() === parent["allChildren"]).toBeFalsy()
  })
})

describe("#getChild", () => {
  describe("ArrayParent", () => {
    let parent
    let entity

    beforeEach(() => {
      parent = new DumbParent(state)
    })
    it("gets child", () => {
      new DumbEntity(state, { parent })
      entity = new DumbEntity(state, { parent })

      expect(parent.getChild(1)).toBe(entity)
    })
    it.todo("gets nothing")
    it.todo("throws if idx out of range")
  })
})

describe("#getTop", () => {
  test("ArrayParent", () => {
    const parent = new DumbParent(state)
    new DumbEntity(state, { parent })
    new DumbEntity(state, { parent })
    const entity = new DumbEntity(state, { parent })

    expect(parent.getTop()).toBe(entity)
  })
})

test("#getBottom", () => {
  const parent = new DumbParent(state)
  const entity = new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })
  new DumbEntity(state, { parent })

  expect(parent.getBottom()).toBe(entity)
})

describe("#indexFits", () => {
  let parent: DumbParent
  describe("limitless", () => {
    beforeEach(() => {
      parent = new DumbParent(state)
    })
    test("empty container", () => {
      expect(parent.indexFits(0)).toBe(true)
      expect(parent.indexFits(1)).toBe(true)
      expect(parent.indexFits(100)).toBe(true)

      expect(parent.indexFits(-1)).toBe(false)
    })
    test("containing some children", () => {
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })

      expect(parent.indexFits(0)).toBe(true)
      expect(parent.indexFits(1)).toBe(true)
      expect(parent.indexFits(100)).toBe(true)

      expect(parent.indexFits(-1)).toBe(false)
    })
  })

  describe("maxChildren", () => {
    beforeEach(() => {
      parent = new DumbParent(state, { maxChildren: 2 })
    })
    test("empty container", () => {
      expect(parent.indexFits(0)).toBe(true)
      expect(parent.indexFits(1)).toBe(true)

      expect(parent.indexFits(100)).toBe(false)
      expect(parent.indexFits(-1)).toBe(false)
    })
    it("shouldn't be checking if spots are occupied", () => {
      new DumbEntity(state, { parent })
      new DumbEntity(state, { parent })

      expect(parent.indexFits(0)).toBe(true)
      expect(parent.indexFits(1)).toBe(true)

      expect(parent.indexFits(100)).toBe(false)
      expect(parent.indexFits(-1)).toBe(false)
    })
  })
})
