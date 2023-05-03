import { logs } from "@cardsgame/utils"

import type { Command } from "../command.js"
import type {
  ClientMessageConditions,
  ClientMessageInitialSubjects,
} from "../interaction/conditions.js"
import { runConditionOnAction } from "../interaction/runConditionOnAction.js"
import type { ServerPlayerMessage } from "../player/serverPlayerMessage.js"
import type { State } from "../state/state.js"

import type { BaseActionDefinition } from "./base.js"
import type {
  ActionsCollection,
  CollectionConditionsResult,
  CollectionContext,
} from "./collection.js"
import {
  CompoundContext,
  isCompoundActionDefinition,
} from "./compoundAction.js"
import { ActionDefinition, isBasicActionDefinition } from "./types.js"

export interface RootContext<S extends State> extends CollectionContext<S> {
  subContexts: Map<ActionDefinition<S>, CollectionContext<S>>
}

export class RootActionDefinition<S extends State = State>
  implements ActionsCollection<S, RootContext<S>>
{
  name = "root"

  private actions: readonly ActionDefinition<S>[]

  constructor(actions: ActionDefinition<S>[]) {
    // Instantiate all actions (and sub actions)
    this.actions = Object.freeze([...actions])
  }

  setupContext(): RootContext<S> {
    return {
      successfulActions: new Set(),
      subContexts: new Map(),
    }
  }

  teardownContext(context: RootContext<S>): void {
    // TODO: teardown each sub context from each action?
    context.successfulActions.clear()
    delete context.successfulActions
    context.subContexts.clear()
    delete context.subContexts
  }

  checkPrerequisites(
    message: ServerPlayerMessage,
    rootContext: RootContext<S>
  ): boolean {
    this.actions.forEach((action) => {
      if (isCompoundActionDefinition(action)) {
        const context = action.setupContext()
        rootContext.subContexts.set(action, context)

        const result = action.checkPrerequisites(message, context)

        if (!result) {
          action.teardownContext(context)
          rootContext.subContexts.delete(action)
        } else {
          rootContext.successfulActions.add(action)
        }

        return result
      } else if (isBasicActionDefinition(action)) {
        const result = action.checkPrerequisites(message)
        if (result) {
          rootContext.successfulActions.add(action)
        }
        return result
      }
    })

    return this.successfulActionsCount(rootContext) > 0
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    initialSubjects: ClientMessageInitialSubjects,
    rootContext: RootContext<S>
  ): CollectionConditionsResult<BaseActionDefinition<S>, S> {
    const rejectedActions: CollectionConditionsResult<
      BaseActionDefinition<S>,
      S
    > = new Map()

    rootContext.successfulActions.forEach((action) => {
      if (isCompoundActionDefinition(action)) {
        // Compounds
        const context = rootContext.subContexts.get(
          action
        ) as CompoundContext<S>
        const subRejectedActions = action.checkConditions(
          con,
          initialSubjects,
          context
        )

        subRejectedActions.forEach((error, action) => {
          rejectedActions.set(action, error)
        })

        if (action.successfulActionsCount(context) === 0) {
          rootContext.successfulActions.delete(action)
        }
      } else if (isBasicActionDefinition(action)) {
        // Basic actions
        const error = runConditionOnAction(con, initialSubjects, action)
        if (error) {
          rejectedActions.set(action, error)
          rootContext.successfulActions.delete(action)
        }
      }
    })

    return rejectedActions
  }

  getCommand(
    state: S,
    event: ServerPlayerMessage,
    rootContext: RootContext<S>
  ): Command<S> {
    const action = this.getSuccessfulAction(rootContext)

    if (isCompoundActionDefinition(action)) {
      const context = rootContext.subContexts.get(action) as CompoundContext<S>
      return action.getCommand(state, event, context)
    } else {
      return action.getCommand(state, event)
    }
  }

  hasFinished(): boolean {
    // Don't remember ROOT as pending
    return true
  }

  getSuccessfulAction(context: RootContext<S>): ActionDefinition<S> {
    return [...context.successfulActions][0]
  }
  successfulActionsCount(context: RootContext<S>): number {
    return context.successfulActions.size
  }
  allActionsCount(): number {
    return this.actions.length
  }
}

/**
 * @ignore
 */
export function isRootActionDefinition<S extends State>(
  o: unknown
): o is RootActionDefinition<S> {
  if (typeof o !== "object" && !(o instanceof RootActionDefinition)) {
    return false
  }

  const nameIsValid = "name" in o && o["name"] === "root"

  const hasActions = "actions" in o && Array.isArray(o["actions"])

  return nameIsValid && hasActions
}
