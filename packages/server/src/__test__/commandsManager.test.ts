import { TestRoom } from "../__helpers__/room.js"
import type { ActionTemplate } from "../actions/actionTemplate.js"
import { GameOver } from "../commands/gameOver.js"
import { Noop } from "../commands/noop.js"
import { Undo } from "../commands/undo.js"
import { CommandsManager } from "../commandsManager.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { Room } from "../room/base.js"
import { State } from "../state/state.js"

let state: State
let event: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>

const clientID = "testClient"

const actions: ActionTemplate<State>[] = [
  {
    name: "Action1",
    interaction: () => [{ name: "one", type: "foo" }],
    conditions: (con) => {},
    command: () => new Noop(),
  } as ActionTemplate<State>,
  {
    name: "Action2",
    interaction: () => [{ name: "two", type: "bar" }],
    conditions: (con) => {},
    command: () => new Noop(),
  } as ActionTemplate<State>,
  {
    name: "GameOver",
    interaction: () => [{ name: "three", type: "foo" }],
    conditions: (con) => {},
    command: () => new GameOver(null),
  } as ActionTemplate<State>,
]

describe("commandsManager", () => {
  beforeEach(() => {
    state = new State()
    // event = populatePlayerEvent(state, event, clientID)
    room = new TestRoom()
    room.possibleActions = new Set(actions)
    manager = new CommandsManager(room)
    room.commandsManager = manager
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
