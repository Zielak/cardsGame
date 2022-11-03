import type { ActionTemplate, State } from "@cardsgame/server"
import { Noop } from "@cardsgame/server/commands"

export const ActionPickCard: ActionTemplate<State> = {
  name: "ActionPickCard",
  interaction: () => [{ type: "classicCard" }],
  conditions: (con) => {},
  command: () => new Noop(),
}

export const ActionMessage: ActionTemplate<State> = {
  name: "ActionMessage",
  messageType: "customMessage",
  conditions: (con) => {},
  command: () => new Noop(),
}
