import type { Command } from "../../command.js"
import { Noop } from "../../commands/noop.js"
import { ENTITY_INTERACTION } from "../../interaction/types.js"
import { prepareClientMessageContext } from "../../interaction/utils.js"
import { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import { State } from "../../state/state.js"
import type { BaseActionTemplate } from "../base.js"
import { DragActionDefinition } from "../drag/dragAction.js"
import {
  defineEntityAction,
  EntityActionDefinition,
  isEntityActionDefinition,
  isEntityActionTemplate,
} from "../entityAction.js"
import { MessageActionDefinition } from "../messageAction.js"
import { ClientMessageContext } from "../types.js"

jest.mock("../../state/state.js")
jest.mock("../../player/player.js")

const state = new State()
const conditions = () => {}
const command = (() => {}) as () => Command<State>
const baseTemplate: BaseActionTemplate<State> = {
  name: "foo",
  conditions,
  command,
}

describe("isEntityActionTemplate", () => {
  it("rejects non object", () => {
    expect(isEntityActionTemplate("foo")).toBe(false)
    expect(isEntityActionTemplate(1)).toBe(false)
    expect(isEntityActionTemplate(true)).toBe(false)
  })

  it("checks for interaction field", () => {
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction: () => {},
      })
    ).toBe(true)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction: "arst",
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction: 1,
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction: {},
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction: [],
      })
    ).toBe(false)
  })

  it("validates interactionType field if present", () => {
    const interaction = () => {}
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: "tap",
      })
    ).toBe(true)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: "dragstart",
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: "dragend",
      })
    ).toBe(true)

    //

    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: "foo",
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: 1,
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: {},
      })
    ).toBe(false)
    expect(
      isEntityActionTemplate({
        ...baseTemplate,
        interaction,
        interactionType: [],
      })
    ).toBe(false)
  })
})

test("isEntityActionDefinition", () => {
  expect(
    isEntityActionDefinition(
      new EntityActionDefinition({
        ...baseTemplate,
        interaction: () => [],
      })
    )
  ).toBe(true)

  expect(
    isEntityActionDefinition(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      })
    )
  ).toBe(false)

  expect(
    isEntityActionDefinition(
      new DragActionDefinition({
        ...baseTemplate,
        start: {
          interaction: () => [],
          conditions: () => {},
        },
        end: {
          interaction: () => [],
          conditions: () => {},
          command: () => new Noop(),
        },
      })
    )
  ).toBe(false)
})

test("defineEntityAction", () => {
  const actionDef = defineEntityAction({
    ...baseTemplate,
    interaction: () => [],
  })

  expect(typeof actionDef).toBe("object")
  expect(isEntityActionDefinition(actionDef)).toBe(true)
})

describe("EntityActionDefinition.checkPrerequisites", () => {
  let message: ServerPlayerMessage
  let messageContext: ClientMessageContext<State>

  const parentEntity = { type: "pile", name: "mainPile" }
  const targetEntity = {
    type: "classicCard",
    name: "DA",
    isInteractive: () => true,
    idx: 0,
    parent: parentEntity,
  }
  const entities = [targetEntity, parentEntity]

  beforeEach(() => {
    message = {
      entity: targetEntity,
      entities,
      messageType: ENTITY_INTERACTION,
      interaction: "tap",
      timestamp: 123,
    }
  })

  describe("entity interaction message", () => {
    beforeEach(() => {
      messageContext = prepareClientMessageContext(state, message)
    })
    it("accepts expected entity interaction", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
        }).checkPrerequisites(messageContext)
      ).toBe(true)
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
        }).checkPrerequisites(messageContext)
      ).toBe(true)
    })
    it("rejects unexpected entity interaction", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: "deck" }],
        }).checkPrerequisites(messageContext)
      ).toBe(false)
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [],
        }).checkPrerequisites(messageContext)
      ).toBe(false)
    })
  })

  describe("empty entity interaction message", () => {
    beforeEach(() => {
      messageContext = prepareClientMessageContext(state, {
        ...message,
        entity: undefined,
        entities: [],
      })
    })

    it("accepts, if action expects no entities", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [],
        }).checkPrerequisites(messageContext)
      ).toBe(true)
    })
    it("rejects, if action expects entities", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
        }).checkPrerequisites(messageContext)
      ).toBe(false)
    })
    it("accepts with catch-all", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
        }).checkPrerequisites(messageContext)
      ).toBe(true)
    })
  })
})
