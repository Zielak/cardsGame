import type { Command } from "../../../command.js"
import type { State } from "../../../state/state.js"
import type { BaseActionTemplate } from "../../base.js"
import {
  defineEntityAction,
  EntityActionDefinition,
} from "../../entityAction.js"
import {
  defineMessageAction,
  MessageActionDefinition,
} from "../../messageAction.js"
import {
  CompoundActionDefinition,
  CompoundActionTemplate,
  defineCompoundAction,
  isCompoundActionDefinition,
  isCompoundActionTemplate,
} from "../compoundAction.js"

const conditions = () => {}
const command = (() => {}) as () => Command<State>
const baseTemplate: BaseActionTemplate<State> = {
  name: "foo",
  conditions,
  command,
}
const baseCompTemplate = {
  name: "foo",
}

const actionA = defineMessageAction({
  name: "a",
  command,
  conditions,
  messageType: "foo",
})
const actionB = defineMessageAction({
  name: "b",
  command,
  conditions,
  messageType: "bar",
})
const actionC = defineEntityAction({
  name: "c",
  command,
  conditions,
  interaction: () => [{ name: "DA" }],
})

describe("isCompoundActionTemplate", () => {
  it("rejects non object", () => {
    expect(isCompoundActionTemplate("foo")).toBe(false)
    expect(isCompoundActionTemplate(1)).toBe(false)
    expect(isCompoundActionTemplate(true)).toBe(false)
  })

  it("validates actions field", () => {
    expect(
      isCompoundActionTemplate({
        ...baseCompTemplate,
        actions: [actionA, actionB],
        finishActions: [actionC],
      })
    ).toBe(true)

    expect(
      isCompoundActionTemplate({
        ...baseCompTemplate,
        actions: [{}, actionB],
        finishActions: [actionC],
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...baseCompTemplate,
        actions: [actionB, ""],
        finishActions: [actionC],
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...baseCompTemplate,
        actions: {},
        finishActions: [actionC],
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...baseCompTemplate,
        finishActions: [actionC],
      })
    ).toBe(false)
  })

  it("validates finishActions field", () => {
    const template = { ...baseCompTemplate, actions: [actionA] }

    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: [actionA],
      })
    ).toBe(true)
    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: [actionC],
      })
    ).toBe(true)

    //

    expect(
      isCompoundActionTemplate({
        ...template,
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: {},
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: [],
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: "foo",
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        finishActions: true,
      })
    ).toBe(false)
  })

  it("validates abort field if present", () => {
    const template = {
      ...baseCompTemplate,
      actions: [actionA],
      finishActions: [actionB],
    }

    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: [actionA],
      })
    ).toBe(true)
    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: [actionC],
      })
    ).toBe(true)
    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: [],
      })
    ).toBe(true)
    expect(
      isCompoundActionTemplate({
        ...template,
      })
    ).toBe(true)

    //

    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: {},
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: "foo",
      })
    ).toBe(false)
    expect(
      isCompoundActionTemplate({
        ...template,
        abortActions: true,
      })
    ).toBe(false)
  })
})

test("isCompoundActionDefinition", () => {
  expect(
    isCompoundActionDefinition(
      new CompoundActionDefinition({
        ...baseCompTemplate,
        actions: [actionA],
        finishActions: [actionC],
      })
    )
  ).toBe(true)

  expect(
    isCompoundActionDefinition(
      new EntityActionDefinition({
        ...baseTemplate,
        interaction: () => [],
      })
    )
  ).toBe(false)
  expect(
    isCompoundActionDefinition(
      new MessageActionDefinition({
        ...baseTemplate,
        messageType: "foo",
      })
    )
  ).toBe(false)
  expect(isCompoundActionDefinition({})).toBe(false)
  expect(isCompoundActionDefinition([])).toBe(false)
  expect(isCompoundActionDefinition(() => {})).toBe(false)
  expect(isCompoundActionDefinition(1)).toBe(false)
})

test("defineEntityAction", () => {
  const actionDef = defineCompoundAction({
    ...baseCompTemplate,
    actions: [actionA],
    finishActions: [actionC],
  })

  expect(typeof actionDef).toBe("object")
  expect(isCompoundActionDefinition(actionDef)).toBe(true)
})
