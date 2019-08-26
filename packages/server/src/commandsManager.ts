import { Client } from "colyseus"
import { logs, chalk } from "@cardsgame/utils"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ServerPlayerEvent } from "./player"
import { ActionTemplate, ActionsSet } from "./actionTemplate"
import { isInteractive, getParentEntity } from "./traits/entity"
import { ICommand } from "./commands"
import { Room } from "./room"
import { Conditions } from "./conditions"

export class CommandsManager<S extends State> {
  history: ICommand[] = []

  currentCommand: ICommand
  actionPending: boolean = false
  currentAction: ActionTemplate<S>

  possibleActions: ActionsSet<S>

  constructor(private room: Room<S>) {
    this.possibleActions = room.possibleActions
  }

  action(client: Client, event: ServerPlayerEvent) {
    const { state } = this.room

    if (this.actionPending) {
      // Early quit, current action is still on-going.
      throw new Error(
        `Action "${this.currentAction.name}" is still in progress, ignoring...`
      )
    }

    let actions = this.filterActionsByInteraction(event)
    actions = this.filterActionsByConditions(actions, state, event)

    if (actions.length === 0) {
      logs.warn(
        "performAction",
        `Client ${client.id}. No actions found for that "${event.event}" event, ignoring...`
      )
      return
    }

    if (actions.length > 1) {
      logs.warn(
        "performAction",
        `Whoops, even after filtering actions by conditions, I still have ${actions.length} actions! Applying only the first one (ordering actions matter!).`
      )
    }

    try {
      const result = this.parseAction(state, actions[0], event)

      return result
    } catch (error) {
      logs.error(
        "action",
        `Client "${client.id}" failed to perform action. ${error}`
      )
    }
  }

  /**
   * Gets you a list of all possible game actions
   * that match with player's interaction
   */
  filterActionsByInteraction(event: ServerPlayerEvent): ActionTemplate<S>[] {
    logs.groupCollapsed(`Filter out actions by INTERACTIONS`)
    logs.info(`getActionsByInteraction()`)

    const actions = Array.from(this.possibleActions.values()).filter(action => {
      const interactions = action.getInteractions()

      logs.verbose(
        action.name,
        `got`,
        interactions.length,
        `interaction${interactions.length > 1 ? "s" : ""}`,
        interactions.map(def => JSON.stringify(def))
      )

      const interactionMatchesEntity = definition => currentTarget => {
        // Every KEY in definition should be present
        // in the Entity and be of eqaul value
        // or either of values if its an array
        return Object.keys(definition).every((prop: string) => {
          const value = definition[prop]

          // Is simple type or array of these, NOT an {object}
          if (Array.isArray(value) || typeof value !== "object") {
            const values = Array.isArray(value) ? value : [value]
            return values.some(testValue => currentTarget[prop] === testValue)
          }
          if (prop === "parent") {
            const parentOfCurrent = getParentEntity(currentTarget)

            return parentOfCurrent
              ? interactionMatchesEntity(value)(parentOfCurrent)
              : // You game me some definition of "parent"
                // But I don't have a parent...
                false
          }
        })
      }

      const result = interactions.some(definition => {
        if (
          event.entities &&
          (!definition.command || definition.command === "EntityInteraction")
        ) {
          // Check props for every interactive entity in `targets` array
          return event.entities
            .filter(currentTarget => isInteractive(currentTarget))
            .some(interactionMatchesEntity(definition))
        } else if (definition.command) {
          // TODO: react on button click or anything else
          // logs.verbose(
          //   `\t\tCommand:\n\t`,
          //   definition.command,
          //   "===",
          //   event.command
          // )
          return definition.command === event.command
        }
      })

      if (result) {
        logs.notice(action.name, "match!")
      }

      return result
    })

    logs.groupEnd()

    // const logActions = actions.map(el => el.name)
    logs.info(
      "performAction",
      actions.length,
      `actions by this interaction`
      // logActions
    )

    return actions
  }

  filterActionsByConditions(actions, state: S, event: ServerPlayerEvent) {
    logs.group(`Filter out actions by CONDITIONS`)

    const result = actions.filter(action => {
      logs.group(`action: ${chalk.white(action.name)}`)

      const conditionsChecker = new Conditions(state, event)

      let result = true
      let message = ""
      try {
        action.getConditions(conditionsChecker)
      } catch (e) {
        result = false
        message = (e as Error).message
      }

      if (message) {
        logs.verbose("\t", message)
      }
      logs.verbose(`result: ${result}`)

      // logConditionResults(logsResults)
      logs.groupEnd()

      return result
    })

    logs.groupEnd()

    return result
  }

  /**
   * @param action
   * @param state current room's state
   * @param event incomming user's event
   */
  parseAction(
    state: State,
    action: ActionTemplate<S>,
    event: ServerPlayerEvent
  ): boolean {
    let result = false
    this.actionPending = true
    this.currentAction = action
    logs.info("parseAction", "current action:", action.name)

    try {
      let cmd = action.getCommands(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(...cmd)
      }
      this.execute(state, cmd)
      result = true
    } catch (error) {
      this.actionPending = false
      logs.error(
        "parseAction",
        `command "${this.currentCommand &&
          this.currentCommand.constructor.name}" FAILED to execute`,
        error
      )
    }

    this.actionPending = false
    this.currentAction = null

    return result
  }

  execute(state: State, command: ICommand): void {
    this.currentCommand = command
    const commandName = command.constructor.name

    logs.group(commandName, "executing")
    this.currentCommand.execute(state, this.room)
    logs.groupEnd(commandName, "done")

    this.history.push(command)
  }
}
