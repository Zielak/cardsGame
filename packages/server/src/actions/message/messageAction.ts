import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "../../conditions/context/clientMessage.js"
import type { State } from "../../state/state.js"
import type { BaseActionDefinition, BaseActionTemplate } from "../base.js"

/**
 * @category Action definitions
 */
export interface MessageActionTemplate<S extends State = State>
  extends BaseActionTemplate<S> {
  /**
   * Custom game message type
   */
  messageType: string
}

/**
 * @ignore
 */
export class MessageActionDefinition<S extends State = State>
  implements BaseActionDefinition<S>
{
  name: string

  /**
   * Only for use in bots internals
   * @ignore
   */
  get templateMessageType(): string {
    return this.template.messageType
  }

  constructor(private template: MessageActionTemplate<S>) {
    this.name = template.name
  }

  checkPrerequisites(messageContext: ClientMessageContext<S>): boolean {
    return this.template.messageType === messageContext.messageType
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>
  ): void {
    this.template.conditions(con, messageContext)
  }

  getCommand(messageContext: ClientMessageContext<S>): Command<S> {
    return this.template.command(messageContext)
  }
}

/**
 * @category Action definitions
 */
export function defineMessageAction<S extends State = State>(
  template: MessageActionTemplate<S>
): MessageActionDefinition<S> {
  return new MessageActionDefinition(template)
}
