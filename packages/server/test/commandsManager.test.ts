import { Client } from "colyseus"

import { CommandsManager } from "../src/commandsManager"
import { ServerPlayerEvent } from "../src/player"
import { Room } from "../src/room"
import { State } from "../src/state/state"
import { populatePlayerEvent } from "../src/utils"

let state: State
let event: ServerPlayerEvent
let room: Room<State>
let manager: CommandsManager<State>

const client = {
  id: "testClient",
}

const actions = [
  {
    name: "Action1",
    getInteractions: () => [{ name: "one", type: "foo" }],
    getConditions: (con) => {},
    getCommands: () => [],
  },
  {
    name: "Action2",
    getInteractions: () => [{ name: "two", type: "bar" }],
    getConditions: (con) => {},
    getCommands: () => [],
  },
  {
    name: "Action3",
    getInteractions: () => [{ name: "three", type: "foo" }],
    getConditions: (con) => {},
    getCommands: () => [],
  },
]

describe("action", () => {
  beforeEach(() => {
    state = new State()
    event = {} // populatePlayerEvent(state, event, client as Client)
    room = new Room()
    room.possibleActions = new Set(actions)
    manager = new CommandsManager(room)
  })

  it("throws up when another action is still pending", async () => {
    manager.actionPending = true

    await expect(manager.action(client as Client, {})).rejects.toThrow()
  })
})
