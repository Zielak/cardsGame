import { Room as colRoom, Client } from "colyseus"
import { logs } from "./logs"
import { CommandsManager } from "./commandsManager"
import { StartGame } from "./commands/startGame"
import { State } from "./state"
import { Entity } from "./entity"
import { EntityEvents, StateEvents } from "@cardsgame/utils"
import { Player, ServerPlayerEvent } from "./player"
import { ICondition } from "./condition"
import { ICommandFactory } from "./command"

export class Room<S extends State> extends colRoom<S> {
  name = "CardsGame test"

  commandsManager: CommandsManager

  possibleActions: ActionsSet

  onInit(options: any) {
    logs.info(`Room:${this.name}`, "creating new room")
    this.setState(
      new State({
        minClients: options.minClients || 1,
        maxClients: options.maxClients || 4,
        hostID: options.hostID
      })
    )
    this.commandsManager = new CommandsManager()

    this.setupPrivatePropsSync()
    this.onSetupGame(this.state)
  }

  /**
   * Start listening for private prop changes of any existing entity
   */
  setupPrivatePropsSync() {
    this.state.on(
      EntityEvents.privateAttributeChange,
      (data: PrivateAttributeChangeData) => {
        // logs.verbose(`privateAttributeChange`, 'public?', data.public)
        if (data.public) {
          this.broadcast({
            data,
            event: EntityEvents.privateAttributeChange
          })
        } else {
          const client = this.clients.find(c => c.id === data.owner)
          if (client) {
            // logs.log(`privateAttributeChange`, 'sending data to client', client.id, data)
            this.send(client, {
              data,
              event: EntityEvents.privateAttributeChange
            })
          } else {
            // logs.log(`couldn't find the client to sent it to`, data.owner, data)
          }
        }
      }
    )
  }

  addPlayer(clientID: string) {
    const entity = new Player({
      state: this.state,
      clientID: clientID,
      parent: this.state.entities.id
    })

    // const idx = this.entities.children.add(newPlayer)
    // newPlayer.idx = idx

    this.state.players.add({ clientID, entity })

    this.onPlayerAdded(clientID, entity)

    // this.updatePlayers()
    this.state.logTreeState()
  }

  removePlayer(clientID: string) {
    // TODO: What about all player's cards and stuff?
    // I want those cards back, or be discarded, or put back into deck?
    //  ###==> OR make the game author decide what happens. <==###
    const player = this.state.players
      .toArray()
      .find(data => data.clientID === clientID)
    const playerIdx = player.entity.idx
    if (!player) {
      logs.error(
        "removePlayer",
        `can't find player's data, removed already?`,
        clientID
      )
    }
    this.state.entities.removeChild(player.entity.id)
    this.state.players.remove(playerIdx)

    // this.updatePlayers()
    this.state.logTreeState()
  }

  requestJoin(options: any, isRoomNew?: boolean): boolean | number {
    // TODO: private rooms?
    // TODO: reject on maxClients reached?
    return true
  }

  onJoin(client: Client) {
    if (!this.state.isGameStarted) {
      this.addPlayer(client.id)
      this.state.emit(StateEvents.privatePropsSyncRequest, client.id)
      logs.log("onJoin", `player "${client.id}" joined`)
    } else {
      logs.info("onJoin", "player joined, but game already started")
    }
  }

  onLeave(client: Client, consented: boolean) {
    if (consented) {
      this.removePlayer(client.id)
      logs.log("onLeave", `player "${client.id}" left permamently`)
    } else {
      logs.log("onLeave", `player "${client.id}" disconnected, might be back`)
    }
  }

  onMessage(client: Client, event: ServerPlayerEvent) {
    if (event.data === "start" && !this.state.isGameStarted) {
      this.onStartGame(this.state)
      new StartGame().execute(this.state)
      return
    } else if (event.data === "start" && this.state.isGameStarted) {
      logs.log("onMessage", `Game is already started, ignoring...`)
      return
    }

    // Populate event with server-side known data
    if (event.targetPath) {
      // Make sure
      event.targets = this.state
        .getEntitiesAlongPath(event.targetPath)
        .reverse()
        .filter(target => target.interactive)
      event.target = event.targets[0]
    }

    event.player = this.state.players
      .toArray()
      .find(playerData => playerData.clientID === client.id).entity as Player

    const minifyTarget = (e: Entity) => {
      return `${e.type}:${e.name}`
    }
    const minifyPlayer = (p: Player) => {
      return `${p.type}:${p.name}[${p.clientID}]`
    }
    logs.info(
      "onMessage",
      JSON.stringify(
        Object.assign(
          { ...event },
          event.target ? { target: minifyTarget(event.target) } : {},
          { targets: event.targets.map(minifyTarget) },
          event.player ? { player: minifyPlayer(event.player) } : {}
        )
      )
    )
    this.performAction(client, event)
  }

  /**
   * Check conditions and perform given action
   */
  performAction(client: Client, event: ServerPlayerEvent) {
    const actions = this.getActionsByInteraction(event).filter(action => {
      return this.isLegal(action.conditions, event)
    })

    const logActions = actions.map(el => el.name)
    logs.info(
      "performAction",
      `only ${actions.length} filtered by conditions:`,
      logActions
    )

    if (actions.length > 1) {
      logs.warn(
        "performAction",
        `Whoops, even after filtering actions by conditions, I still have ${
          actions.length
        } actions!`
      )
      // log(actions)
    }

    if (actions.length === 0) {
      logs.info("performAction", `no actions, ignoring.`)
      this.broadcast({
        event: "game.info",
        data: `Client ${client.id}: No actions found for that ${
          event.type
        }, ignoring...`
      })
      return
    }

    const result = this.commandsManager.orderExecution(
      actions[0].commandFactory,
      this.state,
      event
    )
    if (result) {
      console.info(`Action completed.`)
    } else {
      this.broadcast({
        event: "game.error",
        data: `Client "${client.id}" failed to perform action.`
      })
    }
  }

  /**
   * Gets you a list of all possible game actions
   * that match with player's interaction
   */
  getActionsByInteraction(event: ServerPlayerEvent): ActionTemplate[] {
    const possibleEntityProps = ["name", "type", "value", "rank", "suit"]

    const actions = Array.from(this.possibleActions.values()).filter(
      template => {
        // All interactions defined in the template by game author
        const interactions = Array.isArray(template.interaction)
          ? template.interaction
          : [template.interaction]

        // TODO: REFACTOR
        // You just introduced event.targets, is an array of all child-parent
        // from the top-most entity down to the thing that was actually clicked.
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
   * Checks all attatched conditions (if any) to see if this action is legal
   */
  isLegal(conditions: ICondition[], event: ServerPlayerEvent): boolean {
    if (conditions === undefined || conditions.length === 0) {
      return true
    }
    return conditions.every(condition => condition(this.state, event))
  }

  /**
   * Will be called right after the game room is created.
   * Prepare your play area now.
   * @param state
   */
  onSetupGame(state: State) {
    logs.error("Room", `onSetupGame is not implemented!`)
  }

  /**
   * Will be called when players agree to start the game.
   * Now is the time to for example deal cards to all players.
   * @param state
   */
  onStartGame(state: State) {
    logs.error("Room", `onStartGame is not implemented!`)
  }

  onPlayerAdded(clientID: string, entity: Entity) {
    logs.info("Room", `onPlayerAdded is not implemented.`)
  }
  onPlayerRemoved(clientID: string) {
    logs.info("Room", `onPlayerRemoved is not implemented.`)
  }
}

export type InteractionDefinition = {
  eventType?: string
  name?: string | string[]
  type?: string | string[]
  value?: number | number[]
  rank?: string | string[]
  suit?: string | string[]
}
export type ActionsSet = Set<ActionTemplate>
export type ActionTemplate = {
  name: string
  interaction?: InteractionDefinition | InteractionDefinition[]
  conditions?: ICondition[]
  commandFactory: ICommandFactory
}
