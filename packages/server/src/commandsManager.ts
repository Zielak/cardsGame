import { Client } from "colyseus"
import { logs } from "./logs"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ICommand } from "./command"
import { ServerPlayerEvent } from "./player"
import { ActionTemplate, ActionsSet } from "./actionTemplate"
import { Entity } from "./entity"
import { InteractionDefinition } from "./room"
import chalk from "chalk"

export class CommandsManager {
  history: ICommand[] = []

  currentCommand: ICommand
  actionPending: boolean = false
  currentAction: ActionTemplate

  possibleActions: ActionsSet

  constructor(possibleActions: ActionsSet) {
    this.possibleActions = possibleActions
  }

  async action(state: State, client: Client, event: ServerPlayerEvent) {
    // Current action is still on-going, and may be a complex one.
    if (this.actionPending) {
    }

    const actions = this.getActionsByInteraction(state, event).filter(
      action => {
        logs.verbose(`\tFilter out actions by CONDITIONS`)
        logs.verbose(
          `┌─ action: ${chalk.white(action.name)} ───────────────────────────`
        )
        const result = action.getConditions(state, event).every(condition => {
          const result = condition(state, event)
          logs.verbose(`│\tcondition: ${condition._name} =`, result)
          return result
        })

        logs.verbose(
          `└─ result:`,
          chalk[result ? "green" : "red"](String(result))
        )

        return result
      }
    )

    if (actions.length === 0) {
      logs.info("performAction", `no actions, ignoring.`)
      throw new Error(
        `Client ${client.id}: No actions found for that ${
          event.eventType
        }, ignoring...`
      )
    }

    if (actions.length > 1) {
      logs.warn(
        "performAction",
        `Whoops, even after filtering actions by conditions, I still have ${
          actions.length
        } actions!`
      )
    }

    return this.parseAction(actions[0], state, event)
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
  getActionsByInteraction(
    state: State,
    event: ServerPlayerEvent
  ): ActionTemplate[] {
    // FIXME: There can be all kinds of unknown props in action definition...

    const actions = Array.from(this.possibleActions.values()).filter(action => {
      const interactions = action.getInteractions(state)

      return interactions.some(definition => {
        if (
          definition.$targetType === undefined ||
          definition.$targetType === "Entity"
        ) {
          // Check props for every interactive entity in `targets` array
          return event.targets
            .filter(currentTarget => currentTarget.interactive)
            .some(currentTarget =>
              // Every key in definition should be present in the Entity
              // and be of eqaul value
              Object.keys(definition).some(
                // TODO: handle `parent`
                key => currentTarget[key] === definition[key]
              )
            )
        } else if (definition.$targetType === "UIButton") {
        }
      })
    })

    const logActions = actions.map(el => el.name)
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
    action: ActionTemplate,
    state: State,
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
    logs.info("parseAction", "current action:", chalk.white(action.name))

    try {
      let cmd = action.getCommands(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(cmd)
      }
      await this.execute(state, cmd)
      result = true
    } catch (error) {
      this.actionPending = false
      logs.error(
        "parseAction",
        `command "${this.currentCommand.constructor.name}" FAILED to execute`,
        error
      )
    }

    this.actionPending = false
    this.currentAction = null

    return result
  }

  async execute(state: State, command: ICommand): Promise<void> {
    this.currentCommand = command
    await this.currentCommand.execute(state)
    this.history.push(command)
  }
}
