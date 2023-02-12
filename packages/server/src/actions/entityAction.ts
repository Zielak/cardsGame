import { logs } from "@cardsgame/utils"

import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import { ENTITY_INTERACTION } from "../interaction/types.js"
import type { Player } from "../player/player.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { QuerableProps } from "../queries/index.js"
import { queryRunner } from "../queries/runner.js"
import type { State } from "../state/state.js"
import { isChild } from "../traits/child.js"

import type { BaseActionDefinition, BaseActionTemplate } from "./base.js"

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
  interaction: (player: Player) => QuerableProps[] | "*"

  /**
   * How do you expect entities to be interacted with, `tap` or `dragend`.
   *
   * Default is `tap` - a sequence of touchStart&End or mouseDown&Up
   *
   */
  interactionType?: Omit<InteractionType, "dragstart">
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
    const { template } = this

    if (!("interactionType" in template)) {
      if (message.interaction !== "tap") {
        return false
      }
      // Continue
    } else if (template.interactionType !== message.interaction) {
      return false
    }

    const interactions = template.interaction(message.player)

    const isCatchAll = interactions === "*"

    if (isCatchAll) {
      logs.debug(template.name, `got "catch-all" interaction definition`)
      return true
    }

    logs.debug(
      template.name,
      `got`,
      interactions.length,
      `interaction definition${interactions.length > 1 ? "s" : ""}`,
      interactions.map((def) => JSON.stringify(def))
    )

    // Expecting interaction but without entity reference?
    // Most likely "dragend" outside bounds of any entity. Synonymous to "dragcancel"?
    if (
      !message.entity &&
      message.messageType === ENTITY_INTERACTION &&
      interactions.length === 0
    ) {
      return true
    }

    return interactions.some((definition) => {
      // Check props for every interactive entity in `targets` array
      return message.entities
        ?.filter((currentTarget) =>
          isChild(currentTarget) ? currentTarget.isInteractive() : false
        )
        .some((entity) => {
          const result = queryRunner(definition)(entity)
          if (result) {
            logs.log(template.name, "match!")
          }
          return result
        })
    })
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

// function, because I don't want people extending it
/**
 * FIXME: should be stateless, so I don't have to have factories
 *        these only complicate things for bots and reusability in compound actions
 */
export function defineEntityAction<S extends State = State>(
  template: EntityActionTemplate<S>
): EntityActionDefinition<S> {
  return new EntityActionDefinition(template)
}
