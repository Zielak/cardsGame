import { TestRoom } from "../__helpers__/room.js"
import type { ActionTemplate } from "../actions/actionTemplate.js"
import { Command } from "../command.js"
import { CommandsManager } from "../commandsManager.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { Room } from "../room/base.js"
import { State } from "../state/state.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

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
    room = new TestRoom()
    room.possibleActions = new Set(actions)
    manager = new CommandsManager(room)
  })
  test.todo("whatever")
})
