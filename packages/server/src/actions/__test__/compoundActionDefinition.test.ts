import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../../interaction/conditions.js"
import { ENTITY_INTERACTION } from "../../interaction/types.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionTemplate } from "../base.js"
import { CompoundActionDefinition, CompoundContext } from "../compoundAction.js"
import { defineEntityAction } from "../entityAction.js"
import { defineMessageAction } from "../messageAction.js"

const conditions = () => {}
const command = (() => {}) as () => Command<State>
const baseTemplate: BaseActionTemplate<State> = {
  name: "foo",
  conditions,
  command,
}

let baseMessage: ServerPlayerMessage
let message: ServerPlayerMessage
let compound: CompoundActionDefinition
let context: CompoundContext<State>

const parentEntity = Object.freeze({ type: "pile", name: "mainPile" })
const targetEntity = Object.freeze({
  type: "classicCard",
  name: "DA",
  isInteractive: () => true,
  idx: 0,
  parent: parentEntity,
})
const entities = [targetEntity, parentEntity]

const actionEntity = defineEntityAction({
  name: "c",
  command,
  conditions,
  interaction: () => [{ name: targetEntity.name }],
})
const ABORT = "abort"
const actionAbort = defineMessageAction({
  name: ABORT,
  command,
  conditions,
  messageType: ABORT,
})
const FINISH = "finish"
const actionFinish = defineMessageAction({
  name: FINISH,
  command,
  conditions,
  messageType: FINISH,
})

beforeEach(() => {
  compound = new CompoundActionDefinition({
    ...baseTemplate,
    actions: [actionEntity],
    abortActions: [actionAbort],
    finishActions: [actionFinish],
  })
  console.log("beforeEach! context")
  context = compound.setupContext()
})

describe("CompoundActionDefinition", () => {
  test("setupContext", () => {
    expect(compound.setupContext()).toStrictEqual({
      successfulActions: new Set(),
      successfulAbort: new Set(),
      successfulFinish: new Set(),
      aborted: false,
      finished: false,
    })
  })

  describe("teardownContext", () => {
    it("returns nothing", () => {
      expect(compound.teardownContext(context)).toBe(undefined)
    })
    it("strips the object", () => {
      compound.teardownContext(context)
      expect(context).toStrictEqual({})
    })
  })

  describe("checkPrerequisites", () => {
    it("runs checkPrerequisites of all sub-actions", () => {
      baseMessage = {
        entity: targetEntity,
        entities,
        messageType: ENTITY_INTERACTION,
        timestamp: 123,
      }

      jest.spyOn(actionEntity, "checkPrerequisites")
      jest.spyOn(actionAbort, "checkPrerequisites")
      jest.spyOn(actionFinish, "checkPrerequisites")

      compound.checkPrerequisites(baseMessage, context)

      expect(actionEntity.checkPrerequisites).toHaveBeenCalledWith(baseMessage)
      expect(actionAbort.checkPrerequisites).toHaveBeenCalledWith(baseMessage)
      expect(actionFinish.checkPrerequisites).toHaveBeenCalledWith(baseMessage)
    })

    it("returns true on one of the actions matching", () => {
      expect(
        compound.checkPrerequisites(
          {
            entity: targetEntity,
            entities,
            messageType: ENTITY_INTERACTION,
            interaction: "tap",
            timestamp: 123,
          },
          context
        )
      ).toBe(true)
    })

    it("returns true on abort matching", () => {
      expect(
        compound.checkPrerequisites(
          { messageType: ABORT, timestamp: 123 },
          context
        )
      ).toBe(true)
    })

    it("returns true on finish matching", () => {
      expect(
        compound.checkPrerequisites(
          { messageType: FINISH, timestamp: 123 },
          context
        )
      ).toBe(true)
    })

    it("returns false on non-matching message", () => {
      expect(
        compound.checkPrerequisites(
          { messageType: "foo", timestamp: 123 },
          context
        )
      ).toBe(false)
    })
  })

  describe("checkConditions", () => {
    const con = (() => {}) as ClientMessageConditions<State>
    const ini = {} as ClientMessageInitialSubjects

    describe("runs checkConditions only on actions which passed prerequisites checks", () => {
      beforeEach(() => {
        jest.resetAllMocks()
        jest.spyOn(actionAbort, "checkConditions")
        jest.spyOn(actionEntity, "checkConditions")
        jest.spyOn(actionFinish, "checkConditions")
      })

      test("abort was successful", () => {
        context.successfulActions.add(actionAbort)
        expect(context.successfulActions.size).toBe(1)

        compound.checkConditions(con, ini, context)
        expect(actionAbort.checkConditions).toHaveBeenCalledWith(con, ini)
        expect(actionFinish.checkConditions).not.toHaveBeenCalled()
        expect(actionEntity.checkConditions).not.toHaveBeenCalled()
      })

      test("finish was successful", () => {
        context.successfulActions.add(actionFinish)
        expect(context.successfulActions.size).toBe(1)

        compound.checkConditions(con, ini, context)
        expect(actionAbort.checkConditions).not.toHaveBeenCalled()
        expect(actionFinish.checkConditions).toHaveBeenCalledWith(con, ini)
        expect(actionEntity.checkConditions).not.toHaveBeenCalled()
      })

      test("action was successful", () => {
        context.successfulActions.add(actionEntity)
        expect(context.successfulActions.size).toBe(1)

        compound.checkConditions(con, ini, context)
        expect(actionAbort.checkConditions).not.toHaveBeenCalled()
        expect(actionFinish.checkConditions).not.toHaveBeenCalled()
        expect(actionEntity.checkConditions).toHaveBeenCalledWith(con, ini)
      })

      test("nothing was successful", () => {
        expect(context.successfulActions.size).toBe(0)
        compound.checkConditions(con, ini, context)
        expect(actionFinish.checkConditions).not.toHaveBeenCalled()
        expect(actionAbort.checkConditions).not.toHaveBeenCalled()
        expect(actionEntity.checkConditions).not.toHaveBeenCalled()
      })
    })
  })

  describe("getCommand", () => {
    beforeEach(() => {
      jest.resetAllMocks()
      jest.spyOn(actionAbort, "getCommand")
      jest.spyOn(actionEntity, "getCommand")
      jest.spyOn(actionFinish, "getCommand")
    })

    it("returns result of only first successful action", () => {
      context.successfulActions.add(actionAbort)
      context.successfulActions.add(actionFinish)

      compound.getCommand({} as State, {} as ServerPlayerMessage, context)

      expect(actionAbort.getCommand).toHaveBeenCalled()
      expect(actionFinish.getCommand).not.toHaveBeenCalled()
      expect(actionEntity.getCommand).not.toHaveBeenCalled()
    })
  })
})
