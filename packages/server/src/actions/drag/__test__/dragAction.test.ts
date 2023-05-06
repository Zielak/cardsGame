import type { Command } from "../../../command.js"
import type { ClientMessageInitialSubjects } from "../../../interaction/conditions.js"
import { ENTITY_INTERACTION } from "../../../interaction/types.js"
import { Player } from "../../../player/player.js"
import type { ServerPlayerMessage } from "../../../player/serverPlayerMessage.js"
import type { State } from "../../../state/state.js"
import { EntityActionDefinition } from "../../entityAction.js"
import { MessageActionDefinition } from "../../messageAction.js"
import {
  DragActionDefinition,
  defineDragAction,
  isDragActionDefinition,
  isDragActionTemplate,
} from "../dragAction.js"

jest.mock("../../../player/player.js")

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
  let player: Player
  let def: DragActionDefinition<State>

  const timestamp = 123

  const fromPatent = { type: "pile", name: "mainPile" }
  const fromEntity = {
    type: "classicCard",
    name: "DA",
    isInteractive: () => true,
    idx: 0,
    parent: fromPatent,
  }
  const toParent = { type: "pile", name: "secondPile" }
  const fromEntities = [fromEntity, fromPatent]

  beforeEach(() => {
    player = new Player({ clientID: "foo" })
    message = {
      entity: fromPatent,
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
  })

  describe("checkPrerequisites", () => {
    it("checks both start and end prerequisites", () => {
      def.start.checkPrerequisites = jest.fn()
      def.end.checkPrerequisites = jest.fn()

      def.checkPrerequisites(message)

      expect(def.start.checkPrerequisites).toHaveBeenCalledWith(message)
      expect(def.end.checkPrerequisites).toHaveBeenCalledWith(message)
    })

    describe("start", () => {
      it("accepts only dragstart", () => {
        expect(
          def.start.checkPrerequisites({ ...message, interaction: "dragstart" })
        ).toBe(true)
      })

      it("accepts tap only if player isn't tap-dragging yet", () => {
        message.interaction = "tap"

        expect(def.start.checkPrerequisites(message)).toBe(true)

        player.isTapDragging = true

        expect(def.start.checkPrerequisites(message)).toBe(false)
      })

      it("doesn't accept dragend", () => {
        expect(
          def.start.checkPrerequisites({ ...message, interaction: "dragend" })
        ).toBe(false)
      })
    })

    describe("end", () => {
      it("accepts only dragstart", () => {
        expect(
          def.end.checkPrerequisites({ ...message, interaction: "dragend" })
        ).toBe(true)
      })

      it("accepts tap only if player has initiated tap-dragging", () => {
        message.interaction = "tap"
        player.isTapDragging = true

        expect(def.end.checkPrerequisites(message)).toBe(true)

        player.isTapDragging = false

        expect(def.end.checkPrerequisites(message)).toBe(false)
      })

      it("doesn't accept dragstart", () => {
        expect(
          def.end.checkPrerequisites({ ...message, interaction: "dragstart" })
        ).toBe(false)
      })
    })
  })

  describe("checkConditions", () => {
    const con = {}
    let initialSubjects: ClientMessageInitialSubjects

    beforeEach(() => {
      initialSubjects = {
        messageType: "bar",
        interaction: "tap",
        player,
        entity: {},
      }
    })

    it("calls conditions of start on dragstart", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      initialSubjects.interaction = "dragstart"

      def.checkConditions(con as any, initialSubjects)

      expect(def.start.checkConditions).toHaveBeenCalledWith(
        con,
        initialSubjects
      )
      expect(def.end.checkConditions).not.toHaveBeenCalled()
    })

    it("calls conditions of start on tap start", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      player.isTapDragging = false
      initialSubjects.interaction = "tap"

      def.checkConditions(con as any, initialSubjects)

      expect(def.start.checkConditions).toHaveBeenCalledWith(
        con,
        initialSubjects
      )
      expect(def.end.checkConditions).not.toHaveBeenCalled()
    })

    it("calls conditions of end on dragend", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      initialSubjects.interaction = "dragend"

      def.checkConditions(con as any, initialSubjects)

      expect(def.end.checkConditions).toHaveBeenCalledWith(con, initialSubjects)
      expect(def.start.checkConditions).not.toHaveBeenCalled()
    })

    it("calls conditions of end on tap end", () => {
      def.start.checkConditions = jest.fn()
      def.end.checkConditions = jest.fn()

      player.isTapDragging = true
      initialSubjects.interaction = "tap"

      def.checkConditions(con as any, initialSubjects)

      expect(def.end.checkConditions).toHaveBeenCalledWith(con, initialSubjects)
      expect(def.start.checkConditions).not.toHaveBeenCalled()
    })
  })

  describe("getCommand", () => {
    const state = {}

    it("calls command of start on dragstart", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      message.interaction = "dragstart"

      def.getCommand(state as any, message)

      expect(def.start.getCommand).toHaveBeenCalledWith(state, message)
      expect(def.end.getCommand).not.toHaveBeenCalled()
    })

    it("calls command of start on tap start", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      player.isTapDragging = false
      message.interaction = "tap"

      def.getCommand(state as any, message)

      expect(def.start.getCommand).toHaveBeenCalledWith(state, message)
      expect(def.end.getCommand).not.toHaveBeenCalled()
    })

    it("calls command of end on dragend", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      message.interaction = "dragend"

      def.getCommand(state as any, message)

      expect(def.end.getCommand).toHaveBeenCalledWith(state, message)
      expect(def.start.getCommand).not.toHaveBeenCalled()
    })

    it("calls command of end on tap end", () => {
      def.start.getCommand = jest.fn()
      def.end.getCommand = jest.fn()

      player.isTapDragging = true
      message.interaction = "tap"

      def.getCommand(state as any, message)

      expect(def.end.getCommand).toHaveBeenCalledWith(state, message)
      expect(def.start.getCommand).not.toHaveBeenCalled()
    })
  })
})
