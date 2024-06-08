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
export interface EntityActionTemplate<S extends State = State>
  extends BaseActionTemplate<S> {
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
export class EntityActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name: string

  /**
   * Only for use in bots internals
   * @ignore
   */
  get templateInteraction(): EntityActionTemplate<S>["interaction"] {
    return this.template.interaction
  }

  constructor(private template: EntityActionTemplate<S>) {
    this.name = template.name
  }
  abort: () => boolean

  checkPrerequisites(messageContext: ClientMessageContext<S>): boolean {
    if (messageContext.interaction !== "tap") {
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

/**
 * @category Action definitions
 */
export function defineEntityAction<S extends State = State>(
  template: EntityActionTemplate<S>,
): EntityActionDefinition<S> {
  return new EntityActionDefinition(template)
}

/**
 * @category Action definitions
 */
export type EntityActionTemplateInteraction<S extends State> =
  EntityActionTemplate<S>["interaction"]
