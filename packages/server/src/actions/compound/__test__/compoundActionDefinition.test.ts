import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "@/conditions/context/clientMessage.js"
import { prepareConditionsContext } from "@/conditions/context/utils.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import type { ServerPlayerMessage } from "@/player/serverPlayerMessage.js"
import { State } from "@/state/state.js"

import type { Command } from "../../../command.js"
import { prepareActionContext } from "../../../commandsManager/utils.js"
import type { BaseActionTemplate } from "../../base.js"
import type { CollectionContext } from "../../collection/collection.js"
import {
  CompoundActionDefinition,
  CompoundContext,
} from "../../compound/compoundAction.js"
import { defineEntityAction } from "../../entity/entityAction.js"
import { defineMessageAction } from "../../message/messageAction.js"

jest.mock("@/state/state.js")
jest.mock("@/player/player.js")

const state = new State()
const conditions = () => {}
const command = (() => {}) as () => Command<State>
const baseTemplate: BaseActionTemplate<State> = {
  name: "foo",
  conditions,
  command,
}

let baseMessage: ServerPlayerMessage
let messageContext: ClientMessageContext<State>
let compound: CompoundActionDefinition
let context: CollectionContext<CompoundContext<State>>

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
  context = prepareActionContext<CompoundContext<State>>(compound)
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
      expect(context).toStrictEqual({ pending: false })
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
      messageContext = prepareConditionsContext(state, baseMessage)

      jest.spyOn(actionEntity, "checkPrerequisites")
      jest.spyOn(actionAbort, "checkPrerequisites")
      jest.spyOn(actionFinish, "checkPrerequisites")

      compound.checkPrerequisites(messageContext, context)

      expect(actionEntity.checkPrerequisites).toHaveBeenCalledWith(
        messageContext,
      )
      expect(actionAbort.checkPrerequisites).toHaveBeenCalledWith(
        messageContext,
      )
      expect(actionFinish.checkPrerequisites).toHaveBeenCalledWith(
        messageContext,
      )
    })

    it("returns true on one of the actions matching", () => {
      messageContext = prepareConditionsContext(state, {
        entity: targetEntity,
        entities,
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
      })
      expect(compound.checkPrerequisites(messageContext, context)).toBe(true)
    })

    it("returns true on abort matching", () => {
      messageContext = prepareConditionsContext(state, {
        messageType: ABORT,
      })
      expect(compound.checkPrerequisites(messageContext, context)).toBe(true)
    })

    it("returns true on finish matching", () => {
      messageContext = prepareConditionsContext(state, {
        messageType: FINISH,
      })
      expect(compound.checkPrerequisites(messageContext, context)).toBe(true)
    })

    it("returns false on non-matching message", () => {
      messageContext = prepareConditionsContext(state, {
        messageType: "foo",
      })
      expect(compound.checkPrerequisites(messageContext, context)).toBe(false)
    })
  })

  describe("checkConditions", () => {
    const con = (() => {}) as ClientMessageConditions<State>
    messageContext = prepareConditionsContext(state, {
      messageType: ENTITY_INTERACTION,
    })

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

        compound.checkConditions(con, messageContext, context)
        expect(actionAbort.checkConditions).toHaveBeenCalledWith(
          con,
          messageContext,
        )
        expect(actionFinish.checkConditions).not.toHaveBeenCalled()
        expect(actionEntity.checkConditions).not.toHaveBeenCalled()
      })

      test("finish was successful", () => {
        context.successfulActions.add(actionFinish)
        expect(context.successfulActions.size).toBe(1)

        compound.checkConditions(con, messageContext, context)
        expect(actionAbort.checkConditions).not.toHaveBeenCalled()
        expect(actionFinish.checkConditions).toHaveBeenCalledWith(
          con,
          messageContext,
        )
        expect(actionEntity.checkConditions).not.toHaveBeenCalled()
      })

      test("action was successful", () => {
        context.successfulActions.add(actionEntity)
        expect(context.successfulActions.size).toBe(1)

        compound.checkConditions(con, messageContext, context)
        expect(actionAbort.checkConditions).not.toHaveBeenCalled()
        expect(actionFinish.checkConditions).not.toHaveBeenCalled()
        expect(actionEntity.checkConditions).toHaveBeenCalledWith(
          con,
          messageContext,
        )
      })

      test("nothing was successful", () => {
        expect(context.successfulActions.size).toBe(0)
        compound.checkConditions(con, messageContext, context)
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

      compound.getCommand({} as ClientMessageContext<State>, context)

      expect(actionAbort.getCommand).toHaveBeenCalled()
      expect(actionFinish.getCommand).not.toHaveBeenCalled()
      expect(actionEntity.getCommand).not.toHaveBeenCalled()
    })
  })
})
