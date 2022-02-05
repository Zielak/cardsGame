import { ChangeIdx } from "../../src/commands/changeIdx"
import { State } from "../../src/state"
import { DumbParent } from "../helpers/dumbEntities"
import { LabeledEntity } from "../helpers/labeledEntities"

let state: State
let entities: LabeledEntity[]
let parent: DumbParent
let cmd: ChangeIdx

const INITIAL = ["a", "b", "c", "d", "e"]

beforeEach(() => {
  state = new State()
  parent = new DumbParent(state)
  entities = [
    new LabeledEntity(state, { parent, name: "a" }),
    new LabeledEntity(state, { parent, name: "b" }),
    new LabeledEntity(state, { parent, name: "c" }),
    new LabeledEntity(state, { parent, name: "d" }),
    new LabeledEntity(state, { parent, name: "e" }),
  ]
})

describe("single item use", () => {
  it("moves single item down", () => {
    // middle
    cmd = new ChangeIdx(entities[2], 0)
    cmd.execute(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(["c", "a", "b", "d", "e"])

    cmd.undo(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(INITIAL)

    // ----
    // top
    cmd = new ChangeIdx(entities[4], 2)
    cmd.execute(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(["a", "b", "e", "c", "d"])

    cmd.undo(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(INITIAL)
  })

  it("moves single item up", () => {
    // middle
    cmd = new ChangeIdx(entities[2], 3)
    cmd.execute(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(["a", "b", "d", "c", "e"])

    cmd.undo(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(INITIAL)

    // ----
    // bottom
    cmd = new ChangeIdx(entities[0], 4)
    cmd.execute(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(["b", "c", "d", "e", "a"])

    cmd.undo(state)

    expect(
      parent.getChildren<LabeledEntity>().map((e) => e.name)
    ).toStrictEqual(INITIAL)
  })
})
