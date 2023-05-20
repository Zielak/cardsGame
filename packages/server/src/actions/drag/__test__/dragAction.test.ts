import type { Command } from "../../../command.js"
import { prepareActionContext } from "../../../commandsManager/utils.js"
import type { ClientMessageInitialSubjects } from "../../../interaction/conditions.js"
import { ENTITY_INTERACTION } from "../../../interaction/types.js"
import { prepareClientMessageContext } from "../../../interaction/utils.js"
import { Player } from "../../../player/player.js"
import type { ServerPlayerMessage } from "../../../player/serverPlayerMessage.js"
import { State } from "../../../state/state.js"
import type { CollectionContext } from "../../collection.js"
import { EntityActionDefinition } from "../../entityAction.js"
import { MessageActionDefinition } from "../../messageAction.js"
import { ClientMessageContext } from "../../types.js"
import {
  DragActionDefinition,
  DragContext,
  defineDragAction,
  isDragActionDefinition,
  isDragActionTemplate,
} from "../dragAction.js"

jest.mock("../../../player/player.js")
jest.mock("../../../state/state.js")

const state = new State()
const interaction = () => "*"
const conditions = () => {}
const command = (() => {}) as () => Command<State>
const name = "foo"

describe("isDragActionTemplate", () => {
  it("rejects non object", () => {
    expect(isDragActionTemplate("foo")).toBe(false)
    expect(isDragActionTemplate(1)).toBe(false)
    expect(isDragActionTemplate(true)).toBe(false)
  })

  describe("checks for each required key", () => {
    test("top level keys", () => {
      expect(
        isDragActionTemplate({
          name,
          start: { interaction, conditions, command },
          end: { interaction, conditions, command },
        })
      ).toBe(true)

      expect(
        isDragActionTemplate({
          start: command,
          end: { interaction, conditions, command },
        })
      ).toBe(false)
      expect(
        isDragActionTemplate({
          start: { interaction, conditions, command },
          end: command,
        })
      ).toBe(false)
    })

    test("start has optional command", () => {
      expect(
        isDragActionTemplate({
          start: { interaction, conditions },
          end: { interaction, conditions, command },
        })
      ).toBe(true)
    })

    test("interaction is required on both", () => {
      expect(
        isDragActionTemplate({
          start: { conditions, command },
          end: { interaction, conditions, command },
        })
      ).toBe(false)
      expect(
        isDragActionTemplate({
          start: { interaction, conditions, command },
          end: { conditions, command },
        })
      ).toBe(false)
    })

    test("conditions are required on both", () => {
      expect(
        isDragActionTemplate({
          start: { interaction, command },
          end: { interaction, conditions, command },
        })
      ).toBe(false)
      expect(
        isDragActionTemplate({
          start: { interaction, conditions, command },
          end: { interaction, command },
        })
      ).toBe(false)
    })

    test("command is required in end", () => {
      expect(
        isDragActionTemplate({
          start: { interaction, conditions },
          end: { interaction, conditions },
        })
      ).toBe(false)
    })
  })
})

test("isDragActionDefinition", () => {
  expect(
    isDragActionDefinition(
      new DragActionDefinition({
        name,
        start: { interaction, conditions },
        end: { interaction, conditions, command },
      })
    )
  ).toBe(true)

  expect(
    isDragActionDefinition(
      new MessageActionDefinition({
        name,
        conditions,
        command,
        messageType: "foo",
      })
    )
  ).toBe(false)
  expect(
    isDragActionDefinition(
      new EntityActionDefinition({
        name,
        interaction,
        conditions,
        command,
      })
    )
  ).toBe(false)
})

test("defineDragAction", () => {
  const dragDef = defineDragAction({
    name,
    start: { interaction, conditions },
    end: { interaction, conditions, command },
  })

  expect(typeof dragDef).toBe("object")
  expect(isDragActionDefinition(dragDef)).toBe(true)
})

describe("DragActionDefinition", () => {
  let message: ServerPlayerMessage
  let messageContext: ClientMessageContext<State>
  let player: Player
  let def: DragActionDefinition<State>
  let context: CollectionContext<DragContext>

  const timestamp = 123

  const fromPatent = { type: "pile", name: "mainPile" }
  const fromEntity = {
    type: "classicCard",
    name: "DA",
    isInteractive: () => true,
    idx: 0,
    idxPath: [0],
    parent: fromPatent,
  }
  const toParent = { type: "pile", name: "secondPile" }
  const fromEntities = [fromEntity, fromPatent]

  beforeEach(() => {
    player = new Player({ clientID: "foo" })
    message = {
      entity: fromEntity,
      entities: fromEntities,
      messageType: ENTITY_INTERACTION,
      interaction: "tap",
      timestamp: 123,
      player,
    }
    def = new DragActionDefinition({
      name,
      start: { interaction, conditions },
      end: { interaction, conditions, command },
    })
    context = prepareActionContext<DragContext>(def)
  })

  describe("checkPrerequisites", () => {
    it("checks only start", () => {
      def.start.checkPrerequisites = jest.fn()
      def.end.checkPrerequisites = jest.fn()

      messageContext = prepareClientMessageContext(state, message)

      def.checkPrerequisites(messageContext, context)

      expect(def.start.checkPrerequisites).toHaveBeenCalledWith(messageContext)
      expect(def.end.checkPrerequisites).not.toHaveBeenCalled()
    })

    it("checks only end if pending", () => {
      def.start.checkPrerequisites = jest.fn()
      def.end.checkPrerequisites = jest.fn()

      context.pending = true

      messageContext = prepareClientMessageContext(state, message)

      def.checkPrerequisites(messageContext, context)

      expect(def.start.checkPrerequisites).not.toHaveBeenCalled()
      expect(def.end.checkPrerequisites).toHaveBeenCalledWith(messageContext)
    })

    describe("start", () => {
      it("accepts only dragstart", () => {
        messageContext = prepareClientMessageContext(state, {
          ...message,
          interaction: "dragstart",
        })
        expect(def.start.checkPrerequisites(messageContext)).toBe(true)
      })

      it("accepts tap only if player isn't tap-dragging yet", () => {
        message.interaction = "tap"
        messageContext = prepareClientMessageContext(state, message)

        expect(def.start.checkPrerequisites(messageContext)).toBe(true)

        player.isTapDragging = true

        expect(def.start.checkPrerequisites(messageContext)).toBe(false)
      })

      it("doesn't accept dragend", () => {
        messageContext = prepareClientMessageContext(state, {
          ...message,
          interaction: "dragend",
        })
        expect(def.start.checkPrerequisites(messageContext)).toBe(false)
      })
    })

    describe("end", () => {
      it("accepts only dragstart", () => {
        messageContext = prepareClientMessageContext(state, {
          ...message,
          interaction: "dragend",
        })
        expect(def.end.checkPrerequisites(messageContext)).toBe(true)
      })

      it("accepts tap only if player has initiated tap-dragging", () => {
        message.interaction = "tap"
        player.isTapDragging = true
        messageContext = prepareClientMessageContext(state, message)

        expect(def.end.checkPrerequisites(messageContext)).toBe(true)

        player.isTapDragging = false

        expect(def.end.checkPrerequisites(messageContext)).toBe(false)
      })

      it("doesn't accept dragstart", () => {
        messageContext = prepareClientMessageContext(state, {
          ...message,
          interaction: "dragstart",
        })
        expect(def.end.checkPrerequisites(messageContext)).toBe(false)
      })
    })
  })

  describe("checkConditions", () => {
    const con = {}

    beforeEach(() => {
      message = {
        messageType: "bar",
        interaction: "tap",
        player,
        entity: {},
        timestamp: 123,
      }
    })

    it("calls conditions of start on dragstart", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "dragstart",
      })

      def.checkConditions(con as any, messageContext, context)

      expect(def.start.checkConditions).toHaveBeenCalledWith(
        con,
        messageContext
      )
      expect(def.end.checkConditions).not.toHaveBeenCalled()

      expect(context.finished).toBe(false)
    })

    it("calls conditions of start on tap start", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      player.isTapDragging = false
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "tap",
      })

      def.checkConditions(con as any, messageContext, context)

      expect(def.start.checkConditions).toHaveBeenCalledWith(
        con,
        messageContext
      )
      expect(def.end.checkConditions).not.toHaveBeenCalled()

      expect(context.finished).toBe(false)
    })

    it("calls conditions of end on dragend", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      context.pending = true
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "dragend",
      })

      def.checkConditions(con as any, messageContext, context)

      expect(def.end.checkConditions).toHaveBeenCalledWith(con, messageContext)
      expect(def.start.checkConditions).not.toHaveBeenCalled()
    })

    it("calls conditions of end on tap end", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      context.pending = true
      player.isTapDragging = true
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "tap",
      })

      def.checkConditions(con as any, messageContext, context)

      expect(def.end.checkConditions).toHaveBeenCalledWith(con, messageContext)
      expect(def.start.checkConditions).not.toHaveBeenCalled()
    })
  })

  describe("getCommand", () => {
    it("calls command of start on dragstart", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "dragstart",
      })

      def.getCommand(messageContext, context)

      expect(def.start.getCommand).toHaveBeenCalledWith(messageContext)
      expect(def.end.getCommand).not.toHaveBeenCalled()

      expect(context.finished).toBe(false)
    })

    it("calls command (if defined) of start on dragstart", () => {
      def = new DragActionDefinition({
        name,
        start: { interaction, conditions, command },
        end: { interaction, conditions, command },
      })

      jest.spyOn(def.start, "getCommand")
      def.end.getCommand = jest.fn()

      player.dragStartEntity = fromEntity as any
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "dragstart",
      })

      def.getCommand(messageContext, context)

      expect(def.start.getCommand).toHaveBeenCalledWith(messageContext)
      expect(def.end.getCommand).not.toHaveBeenCalled()

      expect(context.finished).toBe(false)
    })

    it("calls command of start on tap start", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      player.isTapDragging = false
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "tap",
      })

      def.getCommand(messageContext, context)

      expect(def.start.getCommand).toHaveBeenCalledWith(messageContext)
      expect(def.end.getCommand).not.toHaveBeenCalled()

      expect(context.finished).toBe(false)
    })

    it("calls command of end on dragend", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      context.pending = true
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "dragend",
      })

      def.getCommand(messageContext, context)

      expect(def.end.getCommand).toHaveBeenCalledWith(messageContext)
      expect(def.start.getCommand).not.toHaveBeenCalled()

      expect(context.finished).toBe(true)
    })

    it("calls command of end on tap end", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      context.pending = true
      player.isTapDragging = true
      messageContext = prepareClientMessageContext(state, {
        ...message,
        interaction: "tap",
      })

      def.getCommand(messageContext, context)

      expect(def.end.getCommand).toHaveBeenCalledWith(messageContext)
      expect(def.start.getCommand).not.toHaveBeenCalled()

      expect(context.finished).toBe(true)
    })
  })
})
