import { ClientMessageContext } from "@/conditions/context/clientMessage.js"
import { prepareConditionsContext } from "@/conditions/context/utils.js"
import { State } from "@/state/state.js"

import type { Command } from "../../command.js"
import type { BaseActionTemplate } from "../base.js"
import { EntityActionDefinition } from "../entity/entityAction.js"
import {
  defineMessageAction,
  MessageActionDefinition,
} from "../message/messageAction.js"
import {
  isMessageActionDefinition,
  isMessageActionTemplate,
} from "../message/utils.js"

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
      }),
    ).toBe(true)
    expect(
      isMessageActionTemplate({
        ...baseTemplate,
      }),
    ).toBe(false)
  })
})

test("isMessageActionDefinition", () => {
  expect(
    isMessageActionDefinition(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      }),
    ),
  ).toBe(true)

  expect(
    isMessageActionDefinition(
      new EntityActionDefinition({
        ...baseTemplate,
        interaction: () => [],
      }),
    ),
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
  let messageContext: ClientMessageContext<State>
  let state: State

  beforeEach(() => {
    state = new State()
    messageContext = prepareConditionsContext(state, {
      messageType: "foo",
    })
  })

  it("rejects non matching messageType", () => {
    expect(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "bar",
      }).checkPrerequisites(messageContext),
    ).toBe(false)
  })

  it("accepts matching messageType", () => {
    expect(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      }).checkPrerequisites(messageContext),
    ).toBe(true)
  })
})
