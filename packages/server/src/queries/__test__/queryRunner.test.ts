import { Player } from "@/player/player.js"
import { State } from "@/state/state.js"

import { LabeledEntity } from "../../__test__/helpers/labeledEntities.js"
import {
  SmartEntity,
  SmartParent,
} from "../../__test__/helpers/smartEntities.js"
import { queryRunner } from "../runner.js"

let state: State,
  parentA: SmartParent,
  parentB: SmartParent,
  targetA: SmartEntity,
  targetB: SmartEntity,
  parentC: SmartParent,
  targetC: SmartEntity,
  targetD: LabeledEntity,
  playerA: Player,
  playerB: Player

describe("multi tests", () => {
  beforeEach(() => {
    state = new State()

    playerA = new Player({ clientID: "playerA" })
    playerB = new Player({ clientID: "playerB" })

    // Root
    parentA = new SmartParent(state, { name: "parentA" })
    parentB = new SmartParent(state, { name: "parentB", owner: playerB })

    targetD = new LabeledEntity(state, { name: "topLevelTargetD" })

    // Parent A
    new SmartEntity(state, { type: "foo", parent: parentA })
    new SmartEntity(state, { type: "baz", parent: parentA })
    new SmartEntity(state, { type: "foo", parent: parentA })
    targetA = new SmartEntity(state, {
      type: "bar",
      name: "targetA",
      parent: parentA,
      owner: playerA,
    })

    // Parent B
    targetB = new SmartEntity(state, {
      type: "bar",
      name: "targetB",
      parent: parentB,
    })
    new SmartEntity(state, { type: "foo", parent: parentB })
    new SmartEntity(state, { name: "bar", parent: parentB })
    parentC = new SmartParent(state, {
      name: "parentC",
      type: "bazzer",
      parent: parentB,
    })
    new SmartEntity(state, { type: "foo", parent: parentB })

    // Parent C
    new SmartEntity(state, { type: "foo", parent: parentC })
    targetC = new SmartEntity(state, {
      type: "bar",
      name: "targetC",
      parent: parentC,
    })
    new SmartEntity(state, { type: "foo", parent: parentC })
    new SmartEntity(state, { type: "foo", parent: parentC })
    new SmartEntity(state, { type: "foo", parent: parentC })
  })

  describe("#query", () => {
    describe("plain values", () => {
      test("starting from state, finds deeply anywhere", () => {
        expect(state.query({ name: "parentA" })).toBe(parentA)
        expect(state.query({ name: "parentB" })).toBe(parentB)
        expect(state.query({ name: "parentC" })).toBe(parentC)

        expect(state.query({ name: "targetA" })).toBe(targetA)
        expect(state.query({ name: "targetB" })).toBe(targetB)
        expect(state.query({ name: "targetC" })).toBe(targetC)
      })

      test("starting from given parent, finds in it and deeply", () => {
        expect(parentB.query({ name: "parentC" })).toBe(parentC)
        expect(parentB.query({ type: "bazzer" })).toBe(parentC)
        expect(parentB.query({ type: "bazzer", name: "parentC" })).toBe(parentC)

        expect(parentB.query({ name: "targetB" })).toBe(targetB)
        expect(parentB.query({ type: "bar" })).toBe(targetB)
        expect(parentB.query({ type: "bar", name: "targetB" })).toBe(targetB)
      })

      test("ownership", () => {
        expect(state.query({ type: "bar", owner: playerA })).toBe(targetA)
        expect(state.query({ type: "bar", owner: playerB })).toBe(targetB)

        // On entity without ownership trait
        expect(
          state.query({ name: "topLevelTargetD", owner: playerA }),
        ).toBeUndefined()
      })
    })

    describe("arrays", () => {
      test("finds either of given names", () => {
        expect(state.query({ name: ["whatever", "targetA"] })).toBe(targetA)
        expect(state.query({ name: ["whatever", "targetC"] })).toBe(targetC)

        expect(
          state.query({ name: ["whatever", "nonexistent"] }),
        ).toBeUndefined()
      })
    })

    describe("functions", () => {
      test("finds first matching name", () => {
        expect(
          state.query<SmartEntity>({ name: (v) => v.startsWith("target") }).id,
        ).toBe(targetA.id)
        expect(state.query({ name: (v) => v.startsWith("parent") })).toBe(
          parentA,
        )
        expect(state.query({ type: (v) => v.includes("zz") })).toBe(parentC)

        expect(state.query({ name: () => false })).toBeUndefined()
      })
    })

    describe("with parent definition", () => {
      test("starting from state, finds deeply anywhere", () => {
        expect(
          state.query({ type: "bazzer", parent: { name: "parentB" } }),
        ).toBe(parentC)
        expect(state.query({ type: "bar", parent: { type: "bazzer" } })).toBe(
          targetC,
        )
      })

      it("doesn't match a top-level entity", () => {
        expect(state.query({ name: "parentA", parent: state })).toBeUndefined()
      })
    })
  })

  describe("#queryAll", () => {
    describe("plain values", () => {
      test("starting from state, finds deeply anywhere", () => {
        expect(state.queryAll({ type: "foo" }).length).toBe(8)
        expect(state.queryAll({ type: "bar" }).length).toBe(3)
      })
      test("starting from state, target one entity", () => {
        expect(state.queryAll({ name: "targetA" }).length).toBe(1)
        expect(state.queryAll({ name: "targetB" }).length).toBe(1)
        expect(state.queryAll({ name: "targetC" }).length).toBe(1)

        expect(state.queryAll({ name: "targetA" })[0]).toBe(targetA)
        expect(state.queryAll({ name: "targetB" })[0]).toBe(targetB)
        expect(state.queryAll({ name: "targetC" })[0]).toBe(targetC)
      })
      test("starting from given parent, finds in it and deeply", () => {
        expect(parentB.queryAll({ type: "foo" }).length).toBe(6)
      })
      test("starting from given parent, target one entity", () => {
        expect(parentB.queryAll({ name: "parentC" })[0]).toBe(parentC)
        expect(parentB.queryAll({ name: "targetB" })[0]).toBe(targetB)
      })
    })

    describe("functions", () => {
      test("finds deeply anywhere", () => {
        expect(
          state.queryAll({
            type: (v) => v.startsWith("f"),
          }).length,
        ).toBe(8)
        expect(
          parentB.queryAll({
            type: (v) => v.startsWith("f"),
          }).length,
        ).toBe(6)
      })
    })

    describe("with parent", () => {
      test("starting from state, finds deeply anywhere", () => {
        expect(
          state.queryAll({
            type: "bazzer",
            parent: { name: "parentB" },
          })[0],
        ).toBe(parentC)
        expect(
          state.queryAll({
            type: "bar",
            parent: { type: "bazzer" },
          })[0],
        ).toBe(targetC)
      })
    })
  })

  test("various fails", () => {
    expect(queryRunner({ name: "whatever" })(state)).toBe(false)
  })
})

describe("queryRunner", () => {
  test("'empty' query returns nothing", () => {
    state = new State()

    expect(state.query({})).toBeUndefined()
  })
})
