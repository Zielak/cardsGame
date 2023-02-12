import type { Command } from "../../command.js"
import { ENTITY_INTERACTION } from "../../interaction/types.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionTemplate } from "../base.js"
import {
  defineEntityAction,
  EntityActionDefinition,
  isEntityActionDefinition,
  isEntityActionTemplate,
} from "../entityAction.js"
import { MessageActionDefinition } from "../messageAction.js"

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
      new EntityActionDefinition({
        ...baseTemplate,
        interaction: () => [],
        interactionType: "tap",
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
  let baseMessage: ServerPlayerMessage
  let message: ServerPlayerMessage

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
    baseMessage = {
      entity: targetEntity,
      entities,
      messageType: ENTITY_INTERACTION,
      timestamp: 123,
    }
  })

  describe("interactionType", () => {
    beforeEach(() => {
      message = {
        ...baseMessage,
        interaction: "tap",
      }
    })

    it("accepts when interactionType matches, or is default", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
          interactionType: "tap",
        }).checkPrerequisites(message)
      ).toBe(true)
    })

    it("rejects on interactionType mismatch", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
          interactionType: "dragstart",
        }).checkPrerequisites(message)
      ).toBe(false)

      // expecting no entities whatsoever
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [],
          interactionType: "dragstart",
        }).checkPrerequisites(message)
      ).toBe(false)

      // catch-all but still mismatch
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
          interactionType: "dragstart",
        }).checkPrerequisites(message)
      ).toBe(false)
    })
  })

  describe("empty entity interaction", () => {
    beforeEach(() => {
      message = {
        ...baseMessage,
        entity: undefined,
        entities: [],
        interaction: "dragend",
      }
    })

    describe("interactionType not defined on template (default tap)", () => {
      test("interaction expects no entities", () => {
        expect(
          new EntityActionDefinition({
            ...baseTemplate,
            interaction: () => [],
          }).checkPrerequisites(message)
        ).toBe(false)
      })
      test("interaction catch-all", () => {
        expect(
          new EntityActionDefinition({
            ...baseTemplate,
            interaction: () => "*",
          }).checkPrerequisites(message)
        ).toBe(false)
      })
    })

    it("accepts, if action expects no entities", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [],
          interactionType: "dragend",
        }).checkPrerequisites(message)
      ).toBe(true)
    })
    it("rejects, if action expects entities", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
        }).checkPrerequisites(message)
      ).toBe(false)
    })
    it("accepts with catch-all", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
          interactionType: "dragend",
        }).checkPrerequisites(message)
      ).toBe(true)
    })
    it("rejects with catch-all, interactionType mismatch", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
          interactionType: "tap",
        }).checkPrerequisites(message)
      ).toBe(false)
    })
  })

  describe("entities in the message", () => {
    beforeEach(() => {
      message = {
        ...baseMessage,
        interaction: "tap",
      }
    })

    it("accepts expected entity interaction", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: targetEntity.type }],
        }).checkPrerequisites(message)
      ).toBe(true)
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => "*",
        }).checkPrerequisites(message)
      ).toBe(true)
    })
    it("rejects unexpected entity interaction", () => {
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [{ type: "deck" }],
        }).checkPrerequisites(message)
      ).toBe(false)
      expect(
        new EntityActionDefinition({
          ...baseTemplate,
          interaction: () => [],
        }).checkPrerequisites(message)
      ).toBe(false)
    })
  })
})
