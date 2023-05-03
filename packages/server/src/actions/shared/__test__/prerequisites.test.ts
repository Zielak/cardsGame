import { LabeledEntity } from "../../../__test__/helpers/labeledEntities.js"
import { ENTITY_INTERACTION } from "../../../interaction/types.js"
import { Player } from "../../../player/player.js"
import type { ServerPlayerMessage } from "../../../player/serverPlayerMessage.js"
import { State } from "../../../state/state.js"
import { checkInteractionQueries } from "../prerequisites.js"
import type { InteractionQueries } from "../types.js"

const clientID = "clientID"

let player: Player
let state: State
let entity: LabeledEntity
let message: ServerPlayerMessage
let query: InteractionQueries

beforeEach(() => {
  state = new State()
  entity = new LabeledEntity(state, { name: "foo", type: "entity" })
  player = new Player({ clientID })

  message = {
    player,
    entity,
    entities: [entity],
    messageType: ENTITY_INTERACTION,
    timestamp: 123,
  }
})

test("* just returns true", () => {
  query = () => "*"
  expect(checkInteractionQueries(message, query)).toBe(true)
})

it("returns true on matching entity", () => {
  query = () => [{ name: "foo" }]
  expect(checkInteractionQueries(message, query)).toBe(true)
})

describe("query expects no entities", () => {
  beforeEach(() => {
    query = () => []
  })

  it("returns true on message without entities", () => {
    expect(
      checkInteractionQueries(
        {
          ...message,
          entity: undefined,
          entities: undefined,
        },
        query
      )
    ).toBe(true)
  })
  it("returns false on message with entities", () => {
    expect(checkInteractionQueries(message, query)).toBe(false)
  })
})

describe("entities matching", () => {
  it("returns true on direct match", () => {
    query = () => [{ name: "foo" }]

    expect(checkInteractionQueries(message, query)).toBe(true)
  })
  it("returns true with multiple expected entities", () => {
    query = () => [{ name: "NO" }, { type: "NO" }, { name: "foo" }]

    expect(checkInteractionQueries(message, query)).toBe(true)
  })
  it("returns false on no match", () => {
    query = () => [{ name: "NO" }, { type: "NO" }]

    expect(checkInteractionQueries(message, query)).toBe(false)
  })
})
