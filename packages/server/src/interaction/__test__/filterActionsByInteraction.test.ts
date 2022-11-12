import type { Command } from "../../command.js"
import type { State } from "../../index.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import { filterActionsByInteraction } from "../filterActionsByInteraction.js"

let baseMessage: ServerPlayerMessage

const parentEntity = { type: "pile", name: "mainPile" }
const targetEntity = {
  type: "classicCard",
  name: "DA",
  isInteractive: () => true,
  idx: 0,
  parent: parentEntity,
}
const entities = [targetEntity, parentEntity]

const conditions = () => {}
const command = (() => {}) as () => Command<State>

beforeEach(() => {
  baseMessage = {
    entity: targetEntity,
    entities,
    messageType: "EntityInteraction",
    timestamp: 123,
  }
})

describe("isInteractionOfEntities", () => {
  it("rejects non matching interactionType", () => {
    const actionTester = filterActionsByInteraction({
      ...baseMessage,
      interaction: "tap",
    })

    expect(
      actionTester({
        name: "foo",
        interaction: () => [{ type: "classicCard" }],
        interactionType: "dragstart",
        conditions,
        command,
      })
    ).toBe(false)
  })

  it("accepts empty entity interaction, if action expects it", () => {
    const actionTester = filterActionsByInteraction({
      ...baseMessage,
      entity: undefined,
      entities: [],
      interaction: "dragend",
    })

    expect(
      actionTester({
        name: "foo",
        interaction: () => [],
        conditions,
        command,
      })
    ).toBe(true)
  })

  it("rejects empty entity interaction, if action expects entities", () => {
    const actionTester = filterActionsByInteraction({
      ...baseMessage,
      entity: undefined,
      entities: [],
      interaction: "dragend",
    })

    expect(
      actionTester({
        name: "foo",
        interaction: () => [{ type: "classicCard" }],
        conditions,
        command,
      })
    ).toBe(false)
  })

  it("accepts expected entity interaction", () => {
    const actionTester = filterActionsByInteraction({
      ...baseMessage,
      interaction: "tap",
    })

    expect(
      actionTester({
        name: "foo",
        interaction: () => [{ type: "classicCard" }],
        conditions,
        command,
      })
    ).toBe(true)
  })

  it("rejects unexpected entity interaction", () => {
    const actionTester = filterActionsByInteraction({
      ...baseMessage,
      interaction: "tap",
    })

    expect(
      actionTester({
        name: "foo",
        interaction: () => [{ type: "deck" }],
        conditions,
        command,
      })
    ).toBe(false)
  })
})

describe("isInteractionOfEvent", () => {
  it("rejects non matching messageType", () => {
    const actionTester = filterActionsByInteraction({
      messageType: "foo",
      timestamp: 123,
    })

    expect(
      actionTester({
        name: "bar",
        messageType: "bar",
        conditions,
        command,
      })
    ).toBe(false)
  })

  it("accepts matching messageType", () => {
    const actionTester = filterActionsByInteraction({
      messageType: "foo",
      timestamp: 123,
    })

    expect(
      actionTester({
        name: "foo",
        messageType: "foo",
        conditions,
        command,
      })
    ).toBe(true)
  })
})

it("rejects some weird action definition?", () => {
  const actionTester = filterActionsByInteraction({
    messageType: "foo",
    timestamp: 123,
  })

  expect(
    actionTester({
      name: "bar",
      conditions,
      command,
    })
  ).toBe(false)
})
