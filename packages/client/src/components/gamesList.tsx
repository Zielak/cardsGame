import { trim } from "../../shared/strings"
import React from "react"

import "./gamesList.scss"

export interface GamesListProps {
  joinRoom(gameName: string): any
  getAvailableRooms(
    roomName: string,
    callback: (rooms: any, err?: string) => any
  ): any
  gameNames: string[]
}
export class GamesList extends React.Component<GamesListProps, {}> {
  timerID: NodeJS.Timeout

  constructor(props: GamesListProps) {
    super(props)
    this.state = props.gameNames.reduce((prev, key) => {
      prev[key] = []
      return prev
    }, {})
  }
  componentDidMount() {
    this.timerID = setInterval(
      () =>
        this.props.gameNames.forEach(gameName => {
          this.props.getAvailableRooms(gameName, (rooms, err) => {
            if (err) {
              console.error(err)
            }
            const newState = {}
            newState[gameName] = rooms
            this.setState(newState)
          })
        }),
      1000
    )
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }
  render() {
    return (
      <aside>
        {this.props.gameNames.map((gameName, idx) => {
          return (
            <GameSection
              key={idx + gameName}
              title={gameName}
              rooms={this.state[gameName]}
              joinRoom={this.props.joinRoom}
            />
          )
        })}
      </aside>
    )
  }
}

interface GameSectionProps {
  title: string
  rooms: RoomEntry[]
  joinRoom: (title: string) => any
}
const GameSection = (props: GameSectionProps) => {
  const rooms = props.rooms.map(room => (
    <li key={room.roomId}>
      <strong>{room.roomId} </strong>({room.clients}/{room.maxClients})
    </li>
  ))
  return (
    <section>
      <header>
        {props.title}
        <button
          type="button"
          className="join"
          onClick={() => props.joinRoom(props.title)}
        >
          Join
        </button>
      </header>
      <ol>{rooms}</ol>
    </section>
  )
}

type GamesListMap = {
  [gameName: string]: GameEntry
}
type GameEntry = {
  name: string
  rooms: RoomEntry[]
}
type RoomEntry = {
  roomId: string
  clients: number
  maxClients: number
  metadata?: any
}
