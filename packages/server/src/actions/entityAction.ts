import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition, BaseActionTemplate } from "./base.js"
import { checkInteractionQueries } from "./shared/prerequisites.js"
import type { InteractionQueries } from "./shared/types.js"

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
  interaction: InteractionQueries
}

function validInteractionType(v: unknown): v is InteractionType {
  return typeof v === "string" && ["tap", "dragend"].some((type) => v === type)
}

/**
 * @ignore
 */
export function isEntityActionTemplate<S extends State = State>(
  o: unknown
): o is EntityActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  const hasInteractionField =
    "interaction" in o && typeof o["interaction"] === "function"

  const hasValidInteractionTypeField =
    "interactionType" in o ? validInteractionType(o["interactionType"]) : true

  return hasInteractionField && hasValidInteractionTypeField
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

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    if (message.interaction !== "tap") {
      return false
    }

    return checkInteractionQueries(message, this.template.interaction)
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ): void {
    this.template.conditions(con, initialSubjects)
  }

  getCommand(state: S, event: ServerPlayerMessage): Command<State> {
    return this.template.command(state, event)
  }
}

/**
 * @ignore
 */
export function isEntityActionDefinition<S extends State>(
  o: unknown
): o is EntityActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof EntityActionDefinition)) {
    return false
  }

  const templateMatches =
    "template" in o && isEntityActionTemplate(o["template"])

  return templateMatches
}

/**
 * @category Action definitions
 */
export function defineEntityAction<S extends State = State>(
  template: EntityActionTemplate<S>
): EntityActionDefinition<S> {
  return new EntityActionDefinition(template)
}
