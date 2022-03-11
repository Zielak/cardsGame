import { ActionTemplate, commands, State } from "@cardsgame/server"

export const ActionPickCard: ActionTemplate<State> = {
  name: "ActionPickCard",
  interaction: () => [{ type: "classicCard" }],
  conditions: (con) => {},
  command: () => new commands.Noop(),
}

export const ActionMessage: ActionTemplate<State> = {
  name: "ActionMessage",
  interaction: "customMessage",
  conditions: (con) => {},
  command: () => new commands.Noop(),
}
