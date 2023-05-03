import { DumbEntity } from "../../__test__/helpers/dumbEntities.js"
import { ENTITY_INTERACTION } from "../../interaction/types.js"
import { Player } from "../../player/player.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import { State } from "../../state/state.js"
import { entityInteraction } from "../entityInteraction.js"

let state: State
let player: Player
let entity: DumbEntity
let inputMessage: RawInteractionClientPlayerMessage
let result: ServerPlayerMessage
let roomMock
const CLIENT_ID = "foo"

beforeEach(() => {
  state = new State()
  player = new Player({ clientID: CLIENT_ID })

  state.players.push(player)
  entity = new DumbEntity(state)
  result = undefined
})

describe("drag events", () => {
  it("remembers entity in player.dragStartEntity", async () => {
    inputMessage = {
      interaction: "dragstart",
      entityPath: [0],
    }
    expect(result).toBeUndefined()

    roomMock = {
      state,
      handleMessage: jest.fn(
        (newMessage) =>
          new Promise((resolve) => {
            result = newMessage
            resolve(true)
          })
      ),
    }

    await entityInteraction.call(
      roomMock,
      { sessionId: CLIENT_ID },
      inputMessage
    )

    expect(roomMock.handleMessage).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
    expect(result.messageType).toBe(ENTITY_INTERACTION)
    expect(result.entity).toBe(entity)
    expect(result.player).toBe(player)
    expect(player.dragStartEntity).toBe(entity)
  })

  it("brings back player's dragged entity into the event", async () => {
    player.dragStartEntity = entity
    inputMessage = {
      interaction: "dragend",
      entityPath: [],
    }
    expect(result).toBeUndefined()

    roomMock = {
      state,
      handleMessage: jest.fn(
        (newMessage) =>
          new Promise((resolve) => {
            result = newMessage
            resolve(true)
          })
      ),
    }

    await entityInteraction.call(
      roomMock,
      { sessionId: CLIENT_ID },
      inputMessage
    )

    expect(roomMock.handleMessage).toHaveBeenCalledTimes(1)
    expect(result).toBeDefined()
    expect(result.messageType).toBe(ENTITY_INTERACTION)
    expect(result.entity).toBeUndefined()
    expect(result.player).toBe(player)
    expect(player.dragStartEntity).toBeUndefined()
  })
})
