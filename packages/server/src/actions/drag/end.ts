import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "@/conditions/context/clientMessage.js"
import type { State } from "@/state/state.js"

import type { Command } from "../../command.js"
import type { BaseActionDefinition, BaseActionTemplate } from "../base.js"
import { checkInteractionQueries } from "../shared/prerequisites.js"
import type { InteractionQueries } from "../shared/types.js"

/**
 * @category Action definitions
 */
export interface DragEndActionTemplate<S extends State = State>
  extends Omit<BaseActionTemplate<S>, "name"> {
  /**
   * Function returning queries for interacted entities.
   *
   * Return "*" to indicate interest in any entity interactions
   *
   * Return empty array to indicate interest in interaction events without
   * a reference to entities.
   */
  interaction: InteractionQueries<S>
}

/**
 * @ignore
 */
export class DragEndActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name = "end"

  constructor(private template: DragEndActionTemplate<S>) {}

  checkPrerequisites(messageContext: ClientMessageContext<S>): boolean {
    if (messageContext.interaction === "tap") {
      if (!messageContext.player.isTapDragging) {
        // Tap fallback available for "end action"
        // only when player has that flag on
        return false
      }
      // Otherwise, let it try its luck with queries
    } else if (messageContext.interaction !== "dragend") {
      // Anything else than "tap" or "dragend" don't interest us here
      return false
    }

    return checkInteractionQueries(messageContext, this.template.interaction)
  }

  checkConditions(
    test: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>,
  ): void {
    this.template.conditions(test, messageContext)
  }

  getCommand(messageContext: ClientMessageContext<S>): Command<State> {
    return this.template.command(messageContext)
  }
}
