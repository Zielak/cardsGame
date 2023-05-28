import { TestRoom } from "../__helpers__/room.js"
import { defineDragAction } from "../actions/drag/dragAction.js"
import { Noop } from "../commands/noop.js"
import { CommandsManager } from "../commandsManager.js"
import { ENTITY_INTERACTION } from "../interaction/constants.js"
import { entityInteraction } from "../messages/entityInteraction.js"
import { Player } from "../player/player.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { Room } from "../room/base.js"
import { State } from "../state/state.js"
import { populatePlayerEvent } from "../utils/populatePlayerEvent.js"

import { DumbEntity } from "./helpers/dumbEntities.js"

let state: State
let player: Player
let inputMessage: RawInteractionClientPlayerMessage
let message: ServerPlayerMessage
let room: Room<State>
let manager: CommandsManager<State>
let entity: DumbEntity

const clientID = "testClient"

const EndCommand = new Noop()

const dragAction = defineDragAction<State>({
  name: "DragTest",
  start: {
    interaction: () => "*",
    conditions: () => {},
  },
  end: {
    interaction: () => "*",
    conditions: () => {},
    command: () => EndCommand,
  },
})
const actions = [dragAction]

beforeEach(() => {
  player = new Player({ clientID })
  state = new State()
  state.players.push(player)
  room = new TestRoom()
  room.state = state
  room.possibleActions = actions
  manager = new CommandsManager(room)
  room.commandsManager = manager
  entity = new DumbEntity(state)
})

describe("populatePlayerEvent", () => {
  it("doesn't modify player", () => {
    expect(player.dragStartEntity).toBeUndefined()
    expect(player.isTapDragging).toBe(false)

    populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "dragstart",
        entityPath: [0],
      },
      clientID
    )

    expect(player.dragStartEntity).toBeUndefined()
    expect(player.isTapDragging).toBe(false)
  })
})

describe("tap events on drag action", () => {
  describe("first tap", () => {
    it("remembers data on player", async () => {
      inputMessage = {
        interaction: "tap",
        entityPath: [0],
      }

      expect(player.isTapDragging).toBe(false)
      expect(player.dragStartEntity).toBeUndefined()

      await entityInteraction.call(room, { sessionId: clientID }, inputMessage)

      expect(player.isTapDragging).toBe(true)
      expect(player.dragStartEntity).toBe(entity)
    })
  })

  describe("second tap", () => {
    it("clears data on player", async () => {
      inputMessage = {
        interaction: "tap",
        entityPath: [0],
      }
      player.isTapDragging = true
      player.dragStartEntity = entity

      await entityInteraction.call(room, { sessionId: clientID }, inputMessage)

      expect(player.isTapDragging).toBe(false)
      expect(player.dragStartEntity).toBeUndefined()
    })
  })
})
