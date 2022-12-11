import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition, BaseActionTemplate } from "./base.js"

export interface MessageActionTemplate<S extends State = State>
  extends BaseActionTemplate<S> {
  /**
   * Custom game message type
   */
  messageType: string
}

export class MessageActionDefinition<S extends State = State>
  implements BaseActionDefinition<S>
{
  name: string

  get messageType(): string {
    return this.template.messageType
  }

  constructor(private template: MessageActionTemplate<S>) {
    this.name = template.name
  }

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    return this.template.messageType === message.messageType
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ): void {
    this.template.conditions(con, initialSubjects)
  }

  getCommand(state: S, event: ServerPlayerMessage): Command<S> {
    return this.template.command(state, event)
  }
}

/**
 * @ignore
 */
export function isMessageActionTemplate<S extends State>(
  o: unknown
): o is MessageActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  return "messageType" in o && typeof o["messageType"] === "string"
}

/**
 * @ignore
 */
export function isMessageActionDefinition<S extends State>(
  o: unknown
): o is MessageActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof MessageActionDefinition)) {
    return false
  }

  const templateMatches =
    "template" in o && isMessageActionTemplate(o["template"])

  return templateMatches
}

// function, because I don't want people extending it
export function defineMessageAction<S extends State = State>(
  template: MessageActionTemplate<S>
): MessageActionDefinition<S> {
  return new MessageActionDefinition(template)
}
