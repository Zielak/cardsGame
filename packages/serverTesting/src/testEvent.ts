import {
  Conditions,
  type ActionDefinition,
  type ServerPlayerMessage,
  type CollectionActionDefinition,
  State,
} from "@cardsgame/server"
import {
  BaseActionDefinition,
  extendsBaseActionDefinition,
  extendsCollectionActionDefinition,
} from "@cardsgame/server/internal/actions"
import { prepareActionContext } from "@cardsgame/server/internal/commandsManager/utils"
import {
  ClientMessageContext,
  ClientMessageConditions,
  playerMessageToInitialSubjects,
  prepareConditionsContext,
} from "@cardsgame/server/internal/conditions/context"
import { runConditionOnAction } from "@cardsgame/server/internal/interaction/runConditionOnAction"

import type { StateGetter } from "./types.js"

export interface TestEvent {
  /**
   * Test if given event would pass in gameplay under current conditions.
   */
  (message: ServerPlayerMessage): boolean
}

function testCollectionAction<S extends State>(
  action: CollectionActionDefinition<S>,
  messageContext: ClientMessageContext<S>,
  con: ClientMessageConditions<S>
): boolean {
  const context = prepareActionContext(action)

  // 1. Prerequisites
  if (!action.checkPrerequisites(messageContext, context)) {
    return false
  }

  // 2. Conditions
  action.checkConditions(con, messageContext, context)

  return action.hasSuccessfulSubActions(context)
}

function testBasicAction<S extends State>(
  action: BaseActionDefinition<S>,
  messageContext: ClientMessageContext<S>,
  con: ClientMessageConditions<S>
): boolean {
  // 1. Prerequisites
  if (!action.checkPrerequisites(messageContext)) {
    return false
  }

  // 2. Conditions
  const error = runConditionOnAction(con, messageContext, action)

  return !error
}

/**
 * Test if given event would pass in gameplay under current conditions.
 */
export function testEvent<S extends State>(
  state: S,
  action: ActionDefinition<S>,
  message: ServerPlayerMessage
): boolean {
  const initialSubjects = playerMessageToInitialSubjects(message)
  const messageContext = prepareConditionsContext(state, initialSubjects)

  const conditionsChecker = new Conditions(messageContext)

  if (extendsCollectionActionDefinition(action)) {
    return testCollectionAction<S>(action, messageContext, conditionsChecker)
  } else if (extendsBaseActionDefinition(action)) {
    return testBasicAction<S>(action, messageContext, conditionsChecker)
  }
}

export function testEventSetup<S extends State>(
  getState: StateGetter<S>,
  action: ActionDefinition<S>
): TestEvent {
  return function testEventInner(message: ServerPlayerMessage): boolean {
    return testEvent(getState(), action, message)
  }
}
