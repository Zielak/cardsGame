import type { ActionTemplate } from "../src/actionTemplate"
import { Command } from "../src/command"
import { CommandsManager } from "../src/commandsManager"
import type { ServerPlayerMessage } from "../src/players/player"
import { Room } from "../src/room"
import { State } from "../src/state"
import { populatePlayerEvent } from "../src/utils/populatePlayerEvent"

let state: State
let event: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>

const clientID = "testClient"

const command = new Command("dummyCommand")

const actions: ActionTemplate<State>[] = [
  {
    name: "Action1",
    interaction: () => [{ name: "one", type: "foo" }],
    conditions: (con) => {},
    command: () => command,
  } as ActionTemplate<State>,
  {
    name: "Action2",
    interaction: () => [{ name: "two", type: "bar" }],
    conditions: (con) => {},
    command: () => command,
  } as ActionTemplate<State>,
  {
    name: "Action3",
    interaction: () => [{ name: "three", type: "foo" }],
    conditions: (con) => {},
    command: () => command,
  } as ActionTemplate<State>,
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
