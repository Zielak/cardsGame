import { logs } from "@cardsgame/utils"
import chalk from "chalk"

import type { Player, ServerPlayerMessage } from "../player/index.js"
import { hasLabel, LabelTrait } from "../traits/label.js"

export function debugRoomMessage(message: ServerPlayerMessage): void {
  const minifyTarget = (e: LabelTrait): string => {
    return `${e.type}:${e.name}`
  }
  const minifyPlayer = (p: Player): string => {
    return `${p.name}[${p.clientID}]`
  }

  const entity = hasLabel(message.entity) ? minifyTarget(message.entity) : ""
  const entities =
    message.entities &&
    message.entities
      .map((e) => (hasLabel(e) ? minifyTarget(e) : "?"))
      .join(", ")
  const entityPath =
    message.entityPath && chalk.green(message.entityPath.join(", "))

  const { data, interaction } = message

  const playerString = message.player
    ? `Player: ${minifyPlayer(message.player)} | `
    : ""

  logs.info(
    "onMessage",
    [
      playerString,
      chalk.white.bold(message.messageType),
      interaction ? ` "${chalk.yellow(interaction)}"` : "",
      "\n\t",
      entityPath ? `path: [${entityPath}], ` : "",
      entity ? `entity:"${entity}", ` : "",
      entities ? `entities: [${entities}], ` : "",
      data ? `\n\tdata: ${JSON.stringify(data)}` : "",
    ].join(""),
  )
}
