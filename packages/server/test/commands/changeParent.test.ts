import { State } from "../../src/state"
import { ChangeParent } from "../../src/commands/changeParent"
import { DumbEntity, DumbArrayParent } from "../helpers/dumbEntities"

let state: State
let entity: DumbEntity
let entities: DumbEntity[]
let parent: DumbArrayParent

beforeEach(() => {
  state = new State()
  entity = new DumbEntity(state)
  entities = [
    new DumbEntity(state),
    new DumbEntity(state),
    new DumbEntity(state),
  ]
  parent = new DumbArrayParent(state)
})

it("moves one entity", () => {
  new ChangeParent(entity, parent).execute(state)

  expect(parent.countChildren()).toBe(1)
  expect(entity.parent).toBe(parent)
})

it("moves multiple entities", () => {
  new ChangeParent(entities, parent).execute(state)

  expect(parent.countChildren()).toBe(3)
  entities.forEach((ent, idx) => {
    expect(ent.parent).toBe(parent)
    expect(ent.idx).toBe(idx)
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
