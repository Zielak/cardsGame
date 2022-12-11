import {
  type ActionDefinition,
  type ActionsCollection,
  type BasicActionDefinition,
  ClientMessageConditions,
  type ClientMessageInitialSubjects,
  isActionsCollection,
  type ServerPlayerMessage,
  State,
} from "@cardsgame/server"
import { runConditionOnAction } from "@cardsgame/server/internal/interaction/runConditionOnAction"

import type { StateGetter } from "./types.js"

export interface TestEvent {
  /**
   * Test if given event would pass in gameplay under current conditions.
   */
  (message: ServerPlayerMessage): boolean
}

function testCollectionAction<S extends State>(
  action: ActionsCollection<S>,
  message: ServerPlayerMessage,
  con: ClientMessageConditions<S>,
  ini: ClientMessageInitialSubjects
): boolean {
  const context = action.setupContext()

  // 1. Prerequisites
  if (!action.checkPrerequisites(message, context)) {
    return false
  }

  // 2. Conditions
  action.checkConditions(con, ini, context)

  return context.successfulActions.size > 0
}

function testBasicAction<S extends State>(
  action: BasicActionDefinition<S>,
  message: ServerPlayerMessage,
  con: ClientMessageConditions<S>,
  ini: ClientMessageInitialSubjects
): boolean {
  // 1. Prerequisites
  if (!action.checkPrerequisites(message)) {
    return false
  }

  // 2. Conditions
  const error = runConditionOnAction(con, ini, action)

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
  const initialSubjects = Object.keys(message)
    .filter((key) => !["timestamp", "entities", "entityPath"].includes(key))
    .reduce((o, key) => {
      o[key] = message[key]
      return o
    }, {} as ClientMessageInitialSubjects)

  const conditionsChecker = new ClientMessageConditions<S>(
    state,
    initialSubjects
  )

  if (isActionsCollection(action)) {
    return testCollectionAction<S>(
      action,
      message,
      conditionsChecker,
      initialSubjects
    )
  } else {
    return testBasicAction<S>(
      action,
      message,
      conditionsChecker,
      initialSubjects
    )
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
