import { LabeledEntity } from "../../../__test__/helpers/labeledEntities.js"
import { ClientMessageContext } from "../../../conditions/context/clientMessage.js"
import { prepareConditionsContext } from "../../../conditions/context/utils.js"
import { ENTITY_INTERACTION } from "../../../interaction/constants.js"
import { Player } from "../../../player/player.js"
import { State } from "../../../state/state.js"
import { checkInteractionQueries } from "../prerequisites.js"
import type { InteractionQueries } from "../types.js"

const clientID = "clientID"

let player: Player
let state: State
let entity: LabeledEntity
let messageContext: ClientMessageContext<State>
let query: InteractionQueries<State>

beforeEach(() => {
  state = new State()
  entity = new LabeledEntity(state, { name: "foo", type: "entity" })
  player = new Player({ clientID })

  messageContext = prepareConditionsContext(state, {
    player,
    entity,
    entities: [entity],
    messageType: ENTITY_INTERACTION,
  })
})

test("* just returns true", () => {
  query = () => "*"
  expect(checkInteractionQueries(messageContext, query)).toBe(true)
})

it("returns true on matching entity", () => {
  query = () => [{ name: "foo" }]
  expect(checkInteractionQueries(messageContext, query)).toBe(true)
})

describe("query expects no entities", () => {
  beforeEach(() => {
    query = () => []
  })

  it("returns true on message without entities", () => {
    expect(
      checkInteractionQueries(
        {
          ...messageContext,
          entity: undefined,
          entities: undefined,
        },
        query
      )
    ).toBe(true)
  })
  it("returns false on message with entities", () => {
    expect(checkInteractionQueries(messageContext, query)).toBe(false)
  })
})

describe("entities matching", () => {
  it("returns true on direct match", () => {
    query = () => [{ name: "foo" }]

    expect(checkInteractionQueries(messageContext, query)).toBe(true)
  })
  it("returns true with multiple expected entities", () => {
    query = () => [{ name: "NO" }, { type: "NO" }, { name: "foo" }]

    expect(checkInteractionQueries(messageContext, query)).toBe(true)
  })
  it("returns false on no match", () => {
    query = () => [{ name: "NO" }, { type: "NO" }]

    expect(checkInteractionQueries(messageContext, query)).toBe(false)
  })
})
