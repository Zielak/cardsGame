import { Client } from "colyseus"
import { logs } from "./logs"
import { CompositeCommand } from "./commands/compositeCommand"
import { State } from "./state"
import { ICommand } from "./command"
import { ServerPlayerEvent } from "./player"
import { ActionTemplate, ActionsSet } from "./actionTemplate"
import { Entity } from "./entity"
import { InteractionDefinition } from "./room"

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

    const actions = this.getActionsByInteraction(state, event).filter(action =>
      action
        .getConditions(state, event)
        .every(condition => condition(state, event))
    )

    if (actions.length === 0) {
      logs.info("performAction", `no actions, ignoring.`)
      throw new Error(
        `Client ${client.id}: No actions found for that ${
          event.type
        }, ignoring...`
      )
    }

    logs.info(
      "performAction",
      `only ${actions.length} filtered by conditions:`,
      actions.map(el => el.name)
    )

    if (actions.length > 1) {
      logs.warn(
        "performAction",
        `Whoops, even after filtering actions by conditions, I still have ${
          actions.length
        } actions!`
      )
    }

    return this.requestExecution(actions[0], state, event)
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
    const possibleEntityProps = ["name", "type", "value", "rank", "suit"]

    const actions = Array.from(this.possibleActions.values()).filter(
      template => {
        // All interactions defined in the template by game author
        const interactions = template.getInteractions(state)

        // TODO: REFACTOR
        // You just introduced event.targets, is an array of all child-parent
        // from the top-most entity down to the thing that was actually clicked.
        // TODO: check for parent props and its parent and so on
        /**
         * * there can be many sets of interactions
         * * an interaction signature may point to elements by set of properties
         * 		['name', 'rank', 'type'...]
         * * FIXME: client may click on nth card in pile, but is required to interact with TOP card only.
         *   - this doesn't work
         *
         * get reversed targets array (from target to its parents)
         * for each interaction (or one)
         * 	for each reversedTargets ->
         * 		chek all its props
         */

        /**
         * For every possible prop, check if its defined in this action.
         * If so, push it to checkProp()
         */
        const entityMatchesInteraction = (
          target: Entity,
          interaction: InteractionDefinition
        ) => {
          return possibleEntityProps.every((prop: string) => {
            if (interaction[prop]) {
              if (Array.isArray(interaction[prop])) {
                return interaction[prop].some(value => value === target[prop])
              } else if (target[prop] !== interaction[prop]) {
                return false
              }
            }
            // Prop either matches or was not defined in interaction/desired
            return true
          })
        }

        return event.targets
          .filter(target => target.interactive)
          .some(target =>
            interactions.some(int => entityMatchesInteraction(target, int))
          )
      }
    )

    const logActions = actions.map(el => el.name)
    logs.info(
      "performAction",
      `${actions.length} actions by this interaction:`,
      logActions
    )

    return actions
  }

  /**
   * "Request" because given action may fail (?)
   * @param action
   * @param state current room's state
   * @param event incomming user's event
   */
  async requestExecution(
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

    try {
      let cmd = action.getCommands(state, event)
      if (Array.isArray(cmd)) {
        cmd = new CompositeCommand(cmd)
      }
      this.currentCommand = cmd
      await this.currentCommand.execute(state)

      this.history.push(cmd)
      result = true
    } catch (e) {
      this.actionPending = false
      logs.error("orderExecution", `command FAILED to execute`, e)
    }

    this.actionPending = false
    this.currentAction = null

    return result
  }
}
