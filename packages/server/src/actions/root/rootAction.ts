import type { Command } from "../../command.js"
import { prepareActionContext } from "../../commandsManager/utils.js"
import type {
  ClientMessageConditions,
  ClientMessageContext,
} from "../../conditions/context/clientMessage.js"
import { runConditionOnAction } from "../../interaction/runConditionOnAction.js"
import type { State } from "../../state/state.js"
import { BaseActionDefinition, extendsBaseActionDefinition } from "../base.js"
import {
  CollectionActionDefinition,
  CollectionConditionsResult,
  CollectionContext,
} from "../collection/collection.js"
import { extendsCollectionActionDefinition } from "../collection/utils.js"
import type { ActionDefinition } from "../types.js"

export type RootContext<S extends State> = {
  successfulActions: Set<ActionDefinition<S>>
  subContexts: Map<
    ActionDefinition<S>,
    CollectionContext<Record<string, unknown>>
  >
}

export class RootActionDefinition<S extends State = State>
  implements CollectionActionDefinition<S, RootContext<S>>
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

  teardownContext(context: CollectionContext<RootContext<S>>): void {
    // TODO: teardown each sub context from each action?
    context.successfulActions.clear()
    delete context.successfulActions
    context.subContexts.clear()
    delete context.subContexts
  }

  checkPrerequisites(
    messageContext: ClientMessageContext<S>,
    rootContext: CollectionContext<RootContext<S>>
  ): boolean {
    this.actions.forEach((action) => {
      if (extendsCollectionActionDefinition(action)) {
        const actionContext = prepareActionContext(action)
        rootContext.subContexts.set(action, actionContext)

        const result = action.checkPrerequisites(messageContext, actionContext)

        if (!result) {
          action.teardownContext(actionContext)
          rootContext.subContexts.delete(action)
        } else {
          rootContext.successfulActions.add(action)
        }

        return result
      } else if (extendsBaseActionDefinition(action)) {
        const result = action.checkPrerequisites(messageContext)
        if (result) {
          rootContext.successfulActions.add(action)
        }
        return result
      }
    })

    return this.hasSuccessfulSubActions(rootContext)
  }

  checkConditions(
    con: ClientMessageConditions<S>,
    messageContext: ClientMessageContext<S>,
    rootContext: CollectionContext<RootContext<S>>
  ): CollectionConditionsResult<BaseActionDefinition<S>> {
    const rejectedActions: CollectionConditionsResult<BaseActionDefinition<S>> =
      new Map()

    rootContext.successfulActions.forEach((action) => {
      if (extendsCollectionActionDefinition(action)) {
        const actionContext = rootContext.subContexts.get(action)
        const subRejectedActions = action.checkConditions(
          con,
          messageContext,
          actionContext
        )

        subRejectedActions?.forEach((error, action) => {
          rejectedActions.set(action, error)
        })

        if (!action.hasSuccessfulSubActions(actionContext)) {
          rootContext.successfulActions.delete(action)
        }
      } else if (extendsBaseActionDefinition(action)) {
        // Basic actions
        const error = runConditionOnAction(con, messageContext, action)
        if (error) {
          rejectedActions.set(action, error)
          rootContext.successfulActions.delete(action)
        }
      }
    })

    return rejectedActions
  }

  getCommand(
    messageContext: ClientMessageContext<S>,
    rootContext: CollectionContext<RootContext<S>>
  ): Command<S> {
    const action = this.getSuccessfulAction(rootContext)

    if (extendsCollectionActionDefinition(action)) {
      const context = rootContext.subContexts.get(action)
      return action.getCommand(messageContext, context)
    } else {
      return action.getCommand(messageContext)
    }
  }

  hasFinished(): boolean {
    // Don't remember ROOT as pending
    return true
  }

  hasSuccessfulSubActions(context: CollectionContext<RootContext<S>>): boolean {
    return context.successfulActions.size > 0
  }
  getSuccessfulAction(
    context: CollectionContext<RootContext<S>>
  ): ActionDefinition<S> {
    return [...context.successfulActions][0]
  }
  _successfulActionsCount(context: CollectionContext<RootContext<S>>): number {
    return context.successfulActions.size
  }
  _allActionsCount(): number {
    return this.actions.length
  }
}
