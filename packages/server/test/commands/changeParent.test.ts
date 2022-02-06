import { ChangeParent } from "../../src/commands/changeParent"
import { State } from "../../src/state"
import { DumbParent, DumbEntity } from "../helpers/dumbEntities"

let state: State
let entity1: DumbEntity
let entity2: DumbEntity
let entity3: DumbEntity
let entity4: DumbEntity
let entity5: DumbEntity
let parent: DumbParent

beforeEach(() => {
  state = new State()
  entity1 = new DumbEntity(state)
  entity2 = new DumbEntity(state)
  entity3 = new DumbEntity(state)
  entity4 = new DumbEntity(state)
  entity5 = new DumbEntity(state)
  parent = new DumbParent(state)
})

it("moves one entity", () => {
  new ChangeParent(entity1, parent).execute(state)

  expect(parent.countChildren()).toBe(1)
  expect(entity1.parent).toBe(parent)
})

describe("moves multiple entities into parent", () => {
  describe("normal order", () => {
    test("bottom", () => {
      const entities = [entity1, entity2]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
    test("middle", () => {
      const entities = [entity2, entity3]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
    test("top", () => {
      const entities = [entity4, entity5]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
  })
  describe("reversed order", () => {
    test("bottom", () => {
      const entities = [entity2, entity1]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
    test("middle", () => {
      const entities = [entity3, entity2]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
    test("top", () => {
      const entities = [entity5, entity4]
      new ChangeParent(entities, parent).execute(state)

      expect(parent.countChildren()).toBe(2)
      entities.forEach((ent, idx) => {
        expect(ent.parent).toBe(parent)
        expect(ent.idx).toBe(idx)
      })
    })
  })
})

it("throws at empty target", async () => {
  await expect(
    new ChangeParent(undefined, undefined).execute(state)
  ).rejects.toThrow(/Target is required/)
})

it("handles empty sources", async () => {
  await expect(
    new ChangeParent([], parent).execute(state)
  ).resolves.toBeUndefined()
})
