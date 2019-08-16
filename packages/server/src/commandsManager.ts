import { Client } from "colyseus"
import { logs, chalk } from "@cardsgame/utils"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ServerPlayerEvent } from "./player"
import { ActionTemplate, ActionsSet } from "./actionTemplate"
import { isInteractive, getParentEntity } from "./traits/entity"
import { ICommand } from "./commands"
import { Room } from "./room"
import { Conditions, ConditionsConstructor } from "./conditions"

export class CommandsManager<S extends State, C extends Conditions<S>> {
  history: ICommand[] = []

  currentCommand: ICommand
  actionPending: boolean = false
  currentAction: ActionTemplate<C>

  possibleActions: ActionsSet<C>
  conditions: ConditionsConstructor<S, C>

  constructor(private room: Room<S, C>) {
    this.possibleActions = room.possibleActions
    this.conditions = room.conditions
  }

  async action(client: Client, event: ServerPlayerEvent) {
    const { state } = this.room

    // Current action is still on-going, and may be a complex one.
    if (this.actionPending) {
    }

    logs.groupCollapsed(`Filter out actions by CONDITIONS`)

    // const extractConditionInfo = (
    //   condition: ICondition,
    //   result?: boolean
    // ): ConditionResult => {
    //   const out: ConditionResult = {
    //     name: condition.name,
    //     result: def(condition.result, result)
    //   }

    //   if (condition.description) {
    //     out.description = condition.description
    //   }
    //   if (condition.subResults) {
    //     out.subResults = condition.subResults
    //   }

    //   return out
    // }

    const actions = this.getActionsByInteraction(event).filter(action => {
      // const logsResults: ConditionResult[] = []

      logs.group(`action: ${chalk.white(action.name)}`)

      const conditionsChecker = new this.conditions(state, event)

      let result = true
      let message = ""
      try {
        action.getConditions(conditionsChecker)
      } catch (e) {
        result = false
        message = e
      }

      logs.verbose(`result: ${result}`)
      if (message) {
        logs.verbose("\t", message)
      }

      // logConditionResults(logsResults)
      logs.groupEnd()

      return result
    })
    logs.groupEnd()

    if (actions.length === 0) {
      logs.error(
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

    return this.parseAction(state, actions[0], event)
      .then(result => {
        if (!result) {
          throw new Error(`Client "${client.id}" failed to perform action.`)
        }
        return result
      })
      .catch(error => {
        throw new Error(`CMD Execution error!, ${error}`)
      })
  }

  /**
   * Gets you a list of all possible game actions
   * that match with player's interaction
   */
  getActionsByInteraction(event: ServerPlayerEvent): ActionTemplate<C>[] {
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

      return interactions.some(definition => {
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
          logs.verbose(
            `\t\tCommand:\n\t`,
            definition.command,
            "===",
            event.command
          )
          return definition.command === event.command
        }
      })
    })

    // const logActions = actions.map(el => el.name)
    logs.info(
      "performAction",
      actions.length,
      `actions by this interaction`
      // logActions
    )

    return actions
  }

  /**
   * "Request" because given action may fail (?)
   * @param action
   * @param state current room's state
   * @param event incomming user's event
   */
  async parseAction(
    state: State,
    action: ActionTemplate<C>,
    event: ServerPlayerEvent
  ): Promise<boolean> {
    // Someone is taking a while, tell current player to wait!
    if (this.actionPending) {
      throw new Error(
        `I'm still performing that other action: ${this.currentAction.name}`
      )
    }

    let result = false
    this.actionPending = true
    this.currentAction = action
    logs.info("parseAction", "current action:", action.name)

    try {
      let cmd = action.getCommands(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(cmd.filter(cmd => typeof cmd === "object"))
      }
      await this.execute(state, cmd)
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

  async execute(state: State, command: ICommand): Promise<void> {
    this.currentCommand = command
    const commandName = command.constructor.name

    logs.group(commandName, "executing")
    await this.currentCommand.execute(state, this.room)
    logs.groupEnd(commandName, "done")

    this.history.push(command)
  }
}
