import type { Command } from "../../command.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionTemplate } from "../base.js"
import { EntityActionDefinition } from "../entityAction.js"
import {
  defineMessageAction,
  isMessageActionDefinition,
  isMessageActionTemplate,
  MessageActionDefinition,
} from "../messageAction.js"

const conditions = () => {}
const command = (() => {}) as () => Command<State>
const baseTemplate: BaseActionTemplate<State> = {
  name: "foo",
  conditions,
  command,
}

describe("isMessageActionTemplate", () => {
  it("rejects non object", () => {
    expect(isMessageActionTemplate("foo")).toBe(false)
    expect(isMessageActionTemplate(1)).toBe(false)
    expect(isMessageActionTemplate(true)).toBe(false)
  })

  it("checks for messageType field", () => {
    expect(
      isMessageActionTemplate({
        ...baseTemplate,
        messageType: "test",
      })
    ).toBe(true)
    expect(
      isMessageActionTemplate({
        ...baseTemplate,
      })
    ).toBe(false)
  })
})

test("isMessageActionDefinition", () => {
  expect(
    isMessageActionDefinition(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      })
    )
  ).toBe(true)

  expect(
    isMessageActionDefinition(
      new EntityActionDefinition({
        ...baseTemplate,
        interaction: () => [],
      })
    )
  ).toBe(false)
})

test("defineMessageAction", () => {
  const actionDef = defineMessageAction({
    ...baseTemplate,
    messageType: "foo",
  })

  expect(typeof actionDef).toBe("object")
  expect(isMessageActionDefinition(actionDef)).toBe(true)
})

describe("EntityActionDefinition.checkPrerequisites", () => {
  let message: ServerPlayerMessage

  beforeEach(() => {
    message = {
      messageType: "foo",
      timestamp: 123,
    }
  })

  it("rejects non matching messageType", () => {
    expect(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "bar",
      }).checkPrerequisites(message)
    ).toBe(false)
  })

  it("accepts matching messageType", () => {
    expect(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      }).checkPrerequisites(message)
    ).toBe(true)
  })
})
