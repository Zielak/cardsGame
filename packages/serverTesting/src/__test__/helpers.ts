import {
  defineEntityAction,
  defineMessageAction,
  State,
} from "@cardsgame/server"
import { Noop } from "@cardsgame/server/commands"

export const ActionPickCard = defineEntityAction({
  name: "ActionPickCard",
  interaction: () => [{ type: "classicCard" }],
  conditions: () => {},
  command: () => new Noop(),
})

export const ActionMessage = defineMessageAction({
  name: "ActionMessage",
  messageType: "customMessage",
  conditions: () => {},
  command: () => new Noop(),
})

export class TestState extends State {
  name = "CustomTestState"
}
