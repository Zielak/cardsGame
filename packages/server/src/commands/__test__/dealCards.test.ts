import { times } from "@cardsgame/utils"

import { State } from "@/state/state.js"

import {
  LabeledEntity,
  LabeledParent,
} from "../../__test__/helpers/labeledEntities.js"
import { TestRoom } from "../../__test__/helpers/room.js"
import type { Command } from "../../command.js"
import { Noop, ChangeParent, DealCards } from "../index.js"

let state: State
let entities: LabeledEntity[]
let source: LabeledParent
let sourceCount: number
let playerA: LabeledParent
let playerB: LabeledParent
let backup: LabeledParent

const room = new TestRoom()

beforeEach(() => {
  state = new State()
  new LabeledEntity(state, { name: "singleEntity" })
  playerA = new LabeledParent(state, { name: "playerA" })
  playerB = new LabeledParent(state, { name: "playerB" })
  source = new LabeledParent(state, { name: "source" })
  entities = [
    new LabeledEntity(state, { parent: source, name: "child1" }),
    new LabeledEntity(state, { parent: source, name: "child2" }),
    new LabeledEntity(state, { parent: source, name: "child3" }),
    new LabeledEntity(state, { parent: source, name: "child4" }),
    new LabeledEntity(state, { parent: source, name: "child5" }),
    new LabeledEntity(state, { parent: source, name: "child6" }),
    new LabeledEntity(state, { parent: source, name: "child7" }),
  ]
  sourceCount = entities.length

  backup = new LabeledParent(state)
  times(
    20,
    (idx) =>
      new LabeledEntity(state, {
        parent: backup,
        name: "backup" + idx,
      }),
  )
})

it("remembers all options", async () => {
  const cmd = new DealCards(source, [playerA, playerB], { count: 2, step: 3 })

  expect(cmd.source.get()).toBe(source)
  expect(cmd.targets.get()[0]).toBe(playerA)
  expect(cmd.targets.get()[1]).toBe(playerB)
  expect(cmd.count).toBe(2)
  expect(cmd.step).toBe(3)
})

describe("dealing without emptying the source", () => {
  describe("to both players", () => {
    test("1 card each", async () => {
      expect(source.countChildren()).toBe(sourceCount)

      await new DealCards(source, [playerA, playerB], { count: 1 }).execute(
        state,
        room,
      )

      expect(source.countChildren()).toBe(sourceCount - 2)
      expect(playerA.countChildren()).toBe(1)
      expect(playerB.countChildren()).toBe(1)
    })

    test("2 cards each", async () => {
      await new DealCards(source, [playerA, playerB], { count: 2 }).execute(
        state,
        room,
      )

      expect(source.countChildren()).toBe(sourceCount - 4)
      expect(playerA.countChildren()).toBe(2)
      expect(playerB.countChildren()).toBe(2)
    })
  })

  describe("to 1 player", () => {
    test("3 cards", async () => {
      await new DealCards(source, playerA, { count: 3 }).execute(state, room)

      expect(source.countChildren()).toBe(sourceCount - 3)
      expect(playerA.countChildren()).toBe(3)
    })
  })
})

describe("Emptying source", () => {
  test("Deals out everything", async () => {
    expect(source.countChildren()).toBe(7)
    expect(playerB.countChildren()).toBe(0)
    expect(playerA.countChildren()).toBe(0)

    await new DealCards(source, [playerA, playerB]).execute(state, room)

    expect(source.countChildren()).toBe(0)
    expect(playerB.countChildren()).toBe(3)
    expect(playerA.countChildren()).toBe(4)
  })

  test("expecting more cards then there are in a deck", async () => {
    const cmd = new DealCards(source, [playerA, playerB], { count: 10 })

    expect(source.countChildren()).toBe(7)
    await cmd.execute(state, room)

    expect(source.countChildren()).toBe(0)
    expect(playerA.countChildren()).toBe(4)
    expect(playerB.countChildren()).toBe(3)
  })

  test("emptying with very high step", async () => {
    const cmd = new DealCards(source, [playerA, playerB], { step: 5 })

    expect(source.countChildren()).toBe(7)
    await cmd.execute(state, room)

    expect(source.countChildren()).toBe(0)
    expect(playerA.countChildren()).toBe(5)
    expect(playerB.countChildren()).toBe(2)
  })

  it("handles onEmptied", async () => {
    const cmd = new DealCards(source, [playerA, playerB], {
      count: 10,
      onEmptied: (): Command =>
        new ChangeParent(() => backup.getChildren(), source),
    })

    await cmd.execute(state, room)

    expect(playerA.countChildren()).toBe(10)
    expect(playerB.countChildren()).toBe(10)
  })

  test("onEmptied not replenishing the source container", async () => {
    const cmd = new DealCards(source, [playerA, playerB], {
      count: 10,
      onEmptied: (): Command => new Noop(),
    })

    await cmd.execute(state, room)

    expect(source.countChildren()).toBe(0)
    expect(playerA.countChildren()).toBe(4)
    expect(playerB.countChildren()).toBe(3)
  })

  it("calls onEmptied on last card to pick which also is last in source", async () => {
    source = new LabeledParent(state, { name: "source" })
    new LabeledEntity(state, { parent: source })

    const spy = jest.fn()
    const cmd = new DealCards(source, playerA, {
      count: 1,
      onEmptied: spy,
    })

    await cmd.execute(state, room)

    expect(spy).toHaveBeenCalled()
    expect(playerA.countChildren()).toBe(1)
  })
})
