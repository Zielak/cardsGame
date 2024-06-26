import { defineEntityAction } from "@/actions/entity/entityAction.js"
import { GameOver } from "@/commands/gameOver.js"
import { Noop } from "@/commands/noop.js"
import { Undo } from "@/commands/undo.js"
import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import { Player } from "@/player/player.js"
import type { ServerPlayerMessage } from "@/player/serverPlayerMessage.js"
import type { Room } from "@/room/base.js"
import { State } from "@/state/state.js"

import { TestRoom } from "../../__test__/helpers/room.js"
import { CommandsManager } from "../commandsManager.js"

jest.mock("@/player/player.js")

let state: State
let event: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>

const clientID = "testClient"

const conditions = (): void => {}
const baseMessage = { timestamp: 123, messageType: ENTITY_INTERACTION }

const actions = [
  defineEntityAction<State>({
    name: "Action1",
    interaction: () => [{ name: "one", type: "foo" }],
    conditions,
    command: () => new Noop(),
  }),
  defineEntityAction<State>({
    name: "Action2",
    interaction: () => [{ name: "two", type: "bar" }],
    conditions,
    command: () => new Noop(),
  }),
  defineEntityAction<State>({
    name: "GameOver",
    interaction: () => [{ name: "three", type: "foo" }],
    conditions,
    command: () => new GameOver(null),
  }),
]

describe("commandsManager", () => {
  beforeEach(() => {
    state = new State()
    // event = populatePlayerEvent(state, event, clientID)
    room = new TestRoom()
    room.possibleActions = actions
    manager = new CommandsManager(room)
    room.commandsManager = manager
  })

  describe("handlePlayerEvent", () => {
    it("throws on failing message", async () => {
      await expect(
        manager.handlePlayerEvent({
          ...baseMessage,
          interaction: "tap",
          player: new Player({ clientID: "foo" }),
        }),
      ).rejects.toThrow()
    })
  })

  describe("executeCommand", () => {
    it("remembers command in history", async () => {
      expect(manager.history.length).toBe(0)
      expect(state.isGameOver).toBe(false)

      const command = new GameOver(null)

      await manager.executeCommand(state, command)

      expect(state.isGameOver).toBe(true)
      expect(manager.history.length).toBe(1)
      expect(manager.history[0]).toBe(command)
    })
  })

  describe("undoLastCommand", () => {
    it("undoes last command, and doesn't remember Undo in history", async () => {
      expect(manager.history.length).toBe(0)
      expect(state.isGameOver).toBe(false)
      const command = new GameOver(null)

      const undo = new Undo()

      await manager.executeCommand(state, command)

      expect(state.isGameOver).toBe(true)
      expect(manager.history.length).toBe(1)
      expect(manager.history[0]).toBe(command)

      await manager.executeCommand(state, undo)

      expect(state.isGameOver).toBe(false)
      expect(manager.history.length).toBe(0)
    })

    it("doesn't throw on empty history", async () => {
      expect(manager.history.length).toBe(0)

      await expect(manager.undoLastCommand(state)).resolves.not.toThrow()

      expect(manager.history.length).toBe(0)
    })
  })
})
