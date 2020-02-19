import { CommandsManager } from "../src/commandsManager"
import { State } from "../src/state"
import { Room } from "../src/room"
import { ServerPlayerEvent } from "../src/player"
import { populatePlayerEvent } from "../src/utils"

let state: State
let event: ServerPlayerEvent
let room: Room<State>
let manager: CommandsManager<State>

const client = {
  id: "testClient"
}

const actions = [
  {
    name: "Action1",
    getInteractions: () => [{ name: "one", type: "foo" }],
    getConditions: con => {},
    getCommands: () => []
  },
  {
    name: "Action2",
    getInteractions: () => [{ name: "two", type: "bar" }],
    getConditions: con => {},
    getCommands: () => []
  },
  {
    name: "Action3",
    getInteractions: () => [{ name: "three", type: "foo" }],
    getConditions: con => {},
    getCommands: () => []
  }
]

beforeEach(() => {
  state = new State()
  event = populatePlayerEvent(state, event, client)
  room = new Room()
  room.possibleActions = new Set(actions)
  manager = new CommandsManager(room)
})

describe("action", () => {
  it("throws up when another action is still pending", () => {
    manager.actionPending = true

    expect(() => manager.action(client, {})).toThrow()
  })
})
