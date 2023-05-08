import type { Command } from "../../command.js"
import { Message } from "../../commands/message.js"
import { Noop } from "../../commands/noop.js"
import { Sequence } from "../../commands/sequence.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../../interaction/conditions.js"
import type { ServerPlayerMessage } from "../../player/serverPlayerMessage.js"
import type { State } from "../../state/state.js"
import type { ChildTrait } from "../../traits/child.js"
import type { BaseActionDefinition, BaseActionTemplate } from "../base.js"
import { checkInteractionQueries } from "../shared/prerequisites.js"
import type { InteractionQueries } from "../shared/types.js"

/**
 * @category Action definitions
 */
export interface DragStartActionTemplate<S extends State = State>
  extends Omit<BaseActionTemplate<S>, "command" | "name"> {
  /**
   * Function returning queries for interacted entities.
   *
   * Return "*" to indicate interest in any entity interactions
   *
   * Return empty array to indicate interest in interaction events without
   * a reference to entities.
   */
  interaction: InteractionQueries

  /**
   * @deprecated until valid use case is found.
   */
  command?: BaseActionTemplate<S>["command"]
}

/**
 * @ignore
 */
export class DragStartActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name = "start"

  constructor(private template: DragStartActionTemplate<S>) {}

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    if (message.interaction === "tap") {
      if (message.player.isTapDragging) {
        // Tap fallback is already initiated.
        // This event should fall to endDrag
        return false
      }
      // Otherwise, let it try its luck with queries
    } else if (message.interaction !== "dragstart") {
      // Anything else than "tap" or "dragstart" don't interest us here
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

  /**
   * @deprecated until valid use case is found.
   */
  getCommand(state: S, event: ServerPlayerMessage): Command<State> {
    const { interaction, player, entity } = event

    if (interaction === "tap" && !player.isTapDragging) {
      // tapFallbackLog.debug(
      //   `success on dragstart action?, interaction:${interaction}, isTapDragging:${player.isTapDragging}`
      // )

      // Initiate Tap fallback here, so Commands would react to this event
      // as if it was a "dragstart" interaction
      player.isTapDragging = true
      player.dragStartEntity = entity as ChildTrait
    }

    if (this.template.command) {
      return new Sequence("dragStart", [
        new Message(player.clientID, "dragStatus", {
          interaction: "dragStart",
          idxPath: player.dragStartEntity.idxPath.join(","),
          status: true,
        }),
        this.template.command(state, event),
      ])
    }

    return this.template.command?.(state, event) || new Noop()
  }
}
