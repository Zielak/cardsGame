import type { Command } from "../command.js"
import { Noop } from "../commands/noop.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition } from "./base.js"
import { EntityActionDefinition, EntityActionTemplate } from "./entityAction.js"

type OptionalCommand<S extends State> = Partial<
  Pick<EntityActionTemplate<S>, "command">
>

type DragStartTemplate<S extends State> = Omit<
  EntityActionTemplate<S>,
  "interactionType" | "name" | "command"
> &
  OptionalCommand<S>

type DragEndTemplate<S extends State> = Omit<
  EntityActionTemplate<S>,
  "interactionType" | "name"
>

/**
 * @category Action definitions
 */
export interface DragActionTemplate<S extends State = State> {
  name: string

  /**
   * Definition for event related to "dragStart"
   */
  start: DragStartTemplate<S>

  /**
   * Definition for event related to "dragEnd".
   * Only considered after passing previous "start" action.
   */
  end: DragEndTemplate<S>
}

/**
 * @ignore
 */
export function isDragActionTemplate<S extends State = State>(
  o: unknown
): o is DragActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  const optionalStartCommand =
    "start" in o && typeof o["start"] === "object" && "command" in o["start"]
      ? typeof o["start"]["command"] === "function"
      : true

  const hasValidStart =
    "start" in o &&
    typeof o["start"] === "object" &&
    typeof o["start"]["interaction"] === "function" &&
    typeof o["start"]["conditions"] === "function" &&
    optionalStartCommand

  const hasValidEnd =
    "end" in o &&
    typeof o["end"] === "object" &&
    typeof o["end"]["interaction"] === "function" &&
    typeof o["end"]["conditions"] === "function" &&
    typeof o["end"]["command"] === "function"

  return hasValidStart && hasValidEnd
}

/**
 * @ignore
 */
export class DragActionDefinition<S extends State>
  implements BaseActionDefinition<S>
{
  name: string
  start: EntityActionDefinition<S>
  end: EntityActionDefinition<S>

  constructor(private template: DragActionTemplate<S>) {
    this.name = template.name
    this.start = new EntityActionDefinition({
      name: `start_${template.name}`,
      interactionType: "dragstart",
      interaction: template.start.interaction,
      conditions: template.start.conditions,
      command: template.start.command ?? (() => new Noop()),
    })
    this.end = new EntityActionDefinition({
      name: `end_${template.name}`,
      ...template.end,
      interactionType: "dragend",
    })
  }

  checkPrerequisites(message: ServerPlayerMessage): boolean {
    if (message.interaction === "dragstart") {
      return this.start.checkPrerequisites(message)
    } else if (message.interaction === "dragend") {
      return this.end.checkPrerequisites(message)
    }
    return false
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects
  ): void {
    if (initialSubjects.event === "dragstart") {
      return this.start.checkConditions(con, initialSubjects)
    } else if (initialSubjects.event === "dragend") {
      return this.end.checkConditions(con, initialSubjects)
    }
  }

  getCommand(state: S, event: ServerPlayerMessage): Command<State> {
    if (event.interaction === "dragstart") {
      return this.start.getCommand(state, event)
    } else if (event.interaction === "dragend") {
      return this.end.getCommand(state, event)
    }
  }
}

/**
 * @ignore
 */
export function isDragActionDefinition<S extends State>(
  o: unknown
): o is DragActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof DragActionDefinition)) {
    return false
  }

  const templateMatches = "template" in o && isDragActionTemplate(o["template"])

  return templateMatches
}

/**
 * @category Action definitions
 */
export function defineDragAction<S extends State = State>(
  template: DragActionTemplate<S>
): DragActionDefinition<S> {
  return new DragActionDefinition(template)
}
