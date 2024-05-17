// eslint just got stupid
/* eslint-disable import/named */
import {
  Conditions,
  type ActionDefinition,
  type ServerPlayerMessage,
  type CollectionActionDefinition,
  State,
  BaseActionDefinition,
  extendsBaseActionDefinition,
  extendsCollectionActionDefinition,
  prepareActionContext,
  ClientMessageContext,
  ClientMessageConditions,
  playerMessageToInitialSubjects,
  prepareConditionsContext,
  runConditionOnAction,
} from "@cardsgame/server"

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
  test: ClientMessageConditions<S>,
): boolean {
  const context = prepareActionContext(action)

  // 1. Prerequisites
  if (!action.checkPrerequisites(messageContext, context)) {
    return false
  }

  // 2. Conditions
  action.checkConditions(test, messageContext, context)

  return action.hasSuccessfulSubActions(context)
}

function testBasicAction<S extends State>(
  action: BaseActionDefinition<S>,
  messageContext: ClientMessageContext<S>,
  test: ClientMessageConditions<S>,
): boolean {
  // 1. Prerequisites
  if (!action.checkPrerequisites(messageContext)) {
    return false
  }

  // 2. Conditions
  const error = runConditionOnAction(test, messageContext, action)

  return !error
}

/**
 * Test if given event would pass in gameplay under current conditions.
 */
export function testEvent<S extends State>(
  state: S,
  action: ActionDefinition<S>,
  message: ServerPlayerMessage,
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
  action: ActionDefinition<S>,
): TestEvent {
  return function testEventInner(message: ServerPlayerMessage): boolean {
    return testEvent(getState(), action, message)
  }
}
