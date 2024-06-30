import { ENTITY_INTERACTION } from "@/interaction/constants.js"
import { Player } from "@/player/player.js"
import type { ServerPlayerMessage } from "@/player/serverPlayerMessage.js"
import { State } from "@/state/state.js"

import { DumbEntity } from "../../__test__/helpers/dumbEntities.js"
import { populatePlayerEvent } from "../populatePlayerEvent.js"

let state: State
let player: Player
let entity: DumbEntity
let result: ServerPlayerMessage
const CLIENT_ID = "foo"

beforeEach(() => {
  state = new State()
  player = new Player({ clientID: CLIENT_ID })

  state.players.push(player)
  entity = new DumbEntity(state)
})

describe("idxPath", () => {
  it("accepts numbers", () => {
    result = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: [1, 2, 3],
      },
      CLIENT_ID,
    )

    expect(result.entityPath).toEqual([1, 2, 3])
  })

  it("sanitizes strings idxPath", () => {
    result = populatePlayerEvent(
      state,
      // @ts-expect-error for testing
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: ["1", "2", "3"],
      } as ClientPlayerMessage,
      CLIENT_ID,
    )

    expect(result.entityPath).toEqual([1, 2, 3])
  })

  it("throws on unexpected idxPath", () => {
    expect(() =>
      populatePlayerEvent(
        state,
        {
          messageType: ENTITY_INTERACTION,
          interaction: "tap",
          // @ts-expect-error for testing
          entityPath: ["nope"],
        },
        CLIENT_ID,
      ),
    ).toThrow(`received "nope", parsed to "NaN".`)

    expect(() =>
      populatePlayerEvent(
        state,
        {
          messageType: ENTITY_INTERACTION,
          interaction: "tap",
          entityPath: [0, NaN],
        },
        CLIENT_ID,
      ),
    ).toThrow("received NaN")

    expect(() =>
      populatePlayerEvent(
        state,
        {
          messageType: ENTITY_INTERACTION,
          interaction: "tap",
          // @ts-expect-error for testing
          entityPath: [{}],
        },
        CLIENT_ID,
      ),
    ).toThrow("couldn't parse value")
  })
})

describe("player", () => {
  it("grabs it from state, given player ref", () => {
    result = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: [0],
      },
      player,
    )

    expect(result.player).toBe(player)
    expect(result.draggedEntity).toBeUndefined()
  })

  it("grabs it from state, given player's clientID", () => {
    result = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: [0],
      },
      player.clientID,
    )

    expect(result.player).toBe(player)
    expect(result.draggedEntity).toBeUndefined()
  })
})

describe("entity", () => {
  it("finds entity by idxPath", () => {
    result = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: [0],
      },
      player,
    )

    expect(Array.isArray(result.entities)).toBe(true)
    expect(result.entities.length).toBe(1)
    expect(result.entities).toStrictEqual([entity])

    expect(result.entity).toBe(entity)

    expect(result.draggedEntity).toBeUndefined()
  })

  it("sets undefined on nonexisting entity", () => {
    result = populatePlayerEvent(
      state,
      {
        messageType: ENTITY_INTERACTION,
        interaction: "tap",
        entityPath: [100],
      },
      player.clientID,
    )

    expect(Array.isArray(result.entities)).toBe(true)
    expect(result.entities.length).toBe(0)
    expect(result.entities).toStrictEqual([])

    expect(result.entity).toBe(undefined)

    expect(result.draggedEntity).toBeUndefined()
  })
})
