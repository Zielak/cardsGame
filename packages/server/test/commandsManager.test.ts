import { ActionTemplate } from "../src/actionTemplate"
import { Command } from "../src/command"
import { CommandsManager } from "../src/commandsManager"
import { ServerPlayerEvent } from "../src/players/player"
import { Room } from "../src/room"
import { State } from "../src/state/state"
import { populatePlayerEvent } from "../src/utils"

let state: State
let event: ServerPlayerEvent
let room: Room<State>
let manager: CommandsManager<State>

const clientID = "testClient"

const command = new Command("dummyCommand")

const actions: ActionTemplate<State>[] = [
  {
    name: "Action1",
    interactions: () => [{ name: "one", type: "foo" }],
    checkConditions: (con) => {},
    getCommand: () => command,
  },
  {
    name: "Action2",
    interactions: () => [{ name: "two", type: "bar" }],
    checkConditions: (con) => {},
    getCommand: () => command,
  },
  {
    name: "Action3",
    interactions: () => [{ name: "three", type: "foo" }],
    checkConditions: (con) => {},
    getCommand: () => command,
  },
]

describe("action", () => {
  beforeEach(() => {
    state = new State()
    event = populatePlayerEvent(state, event, clientID)
    room = new Room()
    room.possibleActions = new Set(actions)
    manager = new CommandsManager(room)
  })
  test.todo("whatever")
})
