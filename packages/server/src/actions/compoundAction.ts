import { logs } from "@cardsgame/utils"

import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import { runConditionOnAction } from "../interaction/runConditionOnAction.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition, BaseActionTemplate } from "./base.js"
import type {
  ActionsCollection,
  CollectionConditionsResult,
  CollectionContext,
} from "./collection.js"
import { BasicActionDefinition, isBasicActionDefinition } from "./types.js"

/**
 * TODO: decide what to do
 * 1. game-moving-cards-test-server has a use case
 * 2. no idea how to make bots deal with compound actions...
 */

/**
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 * @category Action definitions
 */
export interface CompoundActionTemplate<S extends State = State> {
  name: string

  actions: BasicActionDefinition<S>[]

  /**
   * A mean to back out of completing this compound action.
   * Allows you to perform any game state cleanups.
   * Will be checked before any other action in this group.
   *
   * Examples might include user ending drag:
   *
   * - on the starting position (cancelling)
   * - away, without any entity under the pointer
   * - on invalid target
   */
  abortActions?: BasicActionDefinition<S>[]

  /**
   * An action which also marks this whole compound action as success.
   *
   * Example: user ends drag on a valid target
   *
   * At least one "finishAction" is required.
   */
  finishActions: [BasicActionDefinition<S>, ...BasicActionDefinition<S>[]]
}

function actionsAreValid(o: object): boolean {
  return (
    Array.isArray(o["actions"]) &&
    o["actions"].every((a) => isBasicActionDefinition(a))
  )
}
function finishIsValid(o: object): boolean {
  return (
    Array.isArray(o["finishActions"]) &&
    o["finishActions"].length > 0 &&
    o["finishActions"].every((a) => isBasicActionDefinition(a))
  )
}
function optionalAbortIsValid(o: object): boolean {
  if (Array.isArray(o["abortActions"])) {
    return o["abortActions"].every((a) => isBasicActionDefinition(a))
  }

  return typeof o["abortActions"] === "undefined"
}

/**
 * @ignore
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 * @ignore
 */
export function isCompoundActionTemplate<S extends State = State>(
  o: unknown
): o is CompoundActionTemplate<S> {
  if (typeof o !== "object") {
    return false
  }

  return actionsAreValid(o) && finishIsValid(o) && optionalAbortIsValid(o)
}

/**
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 * @ignore
 */
export interface CompoundContext<S extends State> extends CollectionContext<S> {
  successfulActions: Set<BasicActionDefinition<S>>
  successfulAbort: Set<BasicActionDefinition<S>>
  successfulFinish: Set<BasicActionDefinition<S>>
  aborted: boolean
  finished: boolean
}

/**
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 * @ignore
 */
export class CompoundActionDefinition<S extends State = State>
  implements ActionsCollection<S, CompoundContext<S>>
{
  name: string

  private actions: readonly BasicActionDefinition<S>[]
  private finishActions: BasicActionDefinition<S>[]
  private abortActions: BasicActionDefinition<S>[]

  constructor(private template: CompoundActionTemplate<S>) {
    if (!template || template.finishActions.length === 0) {
      throw new Error(
        `CompoundAction "${template.name}" requires at least one entry in "finishActions" array`
      )
    }

    this.name = this.template.name

    this.actions = Object.freeze([...this.template.actions])
    this.finishActions = this.template.finishActions
    this.abortActions = this.template.abortActions || []
  }

  setupContext(): CompoundContext<S> {
    return {
      successfulActions: new Set(),
      successfulAbort: new Set(),
      successfulFinish: new Set(),
      aborted: false,
      finished: false,
    } as CompoundContext<S>
  }

  teardownContext(context: CompoundContext<S>): void {
    context.successfulActions.clear()
    context.successfulAbort.clear()
    context.successfulFinish.clear()
    delete context.successfulActions
    delete context.successfulAbort
    delete context.successfulFinish
    delete context.aborted
    delete context.finished
  }

  checkPrerequisites(
    message: ServerPlayerMessage,
    context: CompoundContext<S>
  ): boolean {
    logs.group(this.template.name)

    this.abortActions
      .filter((action) => action.checkPrerequisites(message))
      .forEach((action) => context.successfulAbort.add(action))

    this.actions
      .filter((action) => action.checkPrerequisites(message))
      .forEach((action) => context.successfulActions.add(action))

    this.finishActions
      .filter((action) => action.checkPrerequisites(message))
      .forEach((action) => context.successfulFinish.add(action))

    logs.groupEnd(
      `sub-actions count: ${this.allActionsCount()} => ${this.successfulActionsCount(
        context
      )}`
    )

    return this.successfulActionsCount(context) > 0
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects,
    context: CompoundContext<S>
  ): CollectionConditionsResult<BaseActionDefinition<S>, S> {
    const rejectedActions: CollectionConditionsResult<
      BaseActionDefinition<S>,
      S
    > = new Map()

    // Abort
    context.successfulAbort.forEach((action) => {
      if (context.aborted) {
        return
      }
      const error = runConditionOnAction(con, initialSubjects, action)
      if (error) {
        rejectedActions.set(action, error)
        context.successfulAbort.delete(action)
      } else {
        logs.debug(
          "Abort is first to succeed, aborting action, ignoring the rest"
        )
        context.aborted = true
        context.successfulActions.clear()
        context.successfulFinish.clear()
        context.successfulAbort.clear()
        context.successfulAbort.add(action)
      }
    })
    if (context.aborted) {
      // Early quit
      return new Map()
    }

    // Finish
    context.successfulFinish.forEach((action) => {
      if (context.finished) {
        return
      }
      const error = runConditionOnAction(con, initialSubjects, action)
      if (error) {
        rejectedActions.set(action, error)
        context.successfulFinish.delete(action)
      } else {
        logs.debug(
          "Finish is first to succeed, finishing action, ignoring the rest"
        )
        context.finished = true
        context.successfulActions.clear()
        context.successfulFinish.clear()
        context.successfulAbort.clear()
        context.successfulFinish.add(action)
      }
    })
    if (context.finished) {
      // Early quit
      return new Map()
    }

    // The rest
    context.successfulActions.forEach((action) => {
      const error = runConditionOnAction(con, initialSubjects, action)
      if (error) {
        rejectedActions.set(action, error)
        context.successfulActions.delete(action)
      }
    })

    // Extra Abandon Conditions

    return rejectedActions
  }

  getCommand(
    state: S,
    event: ServerPlayerMessage,
    context: CompoundContext<S>
  ): Command<S> {
    const [first] = [
      ...context.successfulActions,
      ...context.successfulAbort,
      ...context.successfulFinish,
    ]
    return first.getCommand(state, event)
  }

  /**
   * Marks if after execution either "lastAction" or "cancelAction" executed successfully.
   * Manager should remove this action from its own "pendingActions" record
   */
  hasFinished(context: CompoundContext<S>): boolean {
    return context.aborted || context.finished
  }

  successfulActionsCount(context: CompoundContext<S>): number {
    return (
      context.successfulAbort.size +
      context.successfulActions.size +
      context.successfulFinish.size
    )
  }

  allActionsCount(): number {
    return 1 + this.actions.length + Number(!!this.abortActions)
  }
}

/**
 * @ignore
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 */
export function isCompoundActionDefinition<S extends State>(
  o: unknown
): o is CompoundActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof CompoundActionDefinition)) {
    return false
  }

  const templateMatches =
    "template" in o && isCompoundActionTemplate(o["template"])

  return (
    templateMatches &&
    actionsAreValid(o) &&
    finishIsValid(o) &&
    optionalAbortIsValid(o)
  )
}

/**
 * @ignore
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 */
export function isCompoundActionDefinition_quick<S extends State>(
  o: unknown
): o is CompoundActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof CompoundActionDefinition)) {
    return false
  }

  return "template" in o && Array.isArray(o["actions"]) && "finish" in o
}

// function, because I don't want people extending it
/**
 * ~~@deprecated Focus on drag&drop. Continue with compound once you find a CONCRETE use case for it.~~
 * game-moving-cards-test-server might be enough of use case
 * @category Action definitions
 */
export function defineCompoundAction<S extends State = State>(
  template: CompoundActionTemplate<S>
): CompoundActionDefinition<S> {
  // TODO: validate, no nesting of compound actions!

  return new CompoundActionDefinition(template)
}
