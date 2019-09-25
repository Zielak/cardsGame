import { def } from "@cardsgame/utils"
import { type, Schema } from "@colyseus/schema"
import { State } from "./state"
import { logs } from "@cardsgame/utils"
import { Entity, IdentityTrait } from "./traits"

// TODO: Player shouldn't be on the scene, he's not an object of play
//       Player's pawns could be placed on the board, outside of his domain...
export class Player extends Schema {
  @type("string")
  clientID: string
  @type("string")
  name: string

  @type("number")
  score: number = 0

  @type("number")
  timeLeft: number = -1

  finishedPlaying = false

  // _selectedEntities = new Set<IEntity>()

  // @type("int8")
  // selectedEntitiesCount: number

  constructor(options: IPlayerOptions) {
    super()
    this.clientID = options.clientID
    this.name = def(options.name, getRandomName())
    logs.notice("Player()", `"${this.clientID}", "${this.name}"`)
  }
}

export interface IPlayerOptions {
  clientID: string
  name?: string
}

// Event from client, with stuff auto filled when comming to server
export type ServerPlayerEvent = PlayerEvent & {
  player?: Player
  entity?: Entity
  entities?: Entity[]
}

const randomPlayerNames = [
  "Alicja",
  "Bob",
  "Celine",
  "Darek",
  "Eddy",
  "Franek",
  "Gordon",
  "Hu",
  "Ione",
  "Jerry",
  "Karen",
  "Lukas",
  "Mat",
  "Natalie",
  "Ollie",
  "Pauline",
  "Rupert",
  "Sandra",
  "Tammy",
  "Ulyseus",
  "Vik",
  "Witeck",
  "Xavier",
  "Yumi",
  "Zoltan"
]
const getRandomName = (): string => {
  randomPlayerNames.sort(() => {
    return Math.floor(Math.random() * 3) - 1
  })
  return randomPlayerNames.pop()
}
