import type { Command } from "../../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../../interaction/conditions.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
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
  interaction: InteractionQueries
}

/**
 * @ignore
 */
export class DragEndActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name = "end"

  constructor(private template: DragEndActionTemplate<S>) {}

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    if (message.interaction === "tap") {
      if (!message.player.isTapDragging) {
        // Tap fallback available for "end action"
        // only when player has that flag on
        return false
      }
      // Otherwise, let it try its luck with queries
    } else if (message.interaction !== "dragend") {
      // Anything else than "tap" or "dragend" don't interest us here
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