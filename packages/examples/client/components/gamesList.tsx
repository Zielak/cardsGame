import * as React from "react"
import "./gamesList.scss"

export interface GamesListProps {
  joinRoom(gameName: string): any
  getAvailableRooms(gameName: string): Promise<{}>
  gameNames: string[]
}
export class GamesList extends React.Component<GamesListProps, {}> {
  timerID: NodeJS.Timeout
  active = false

  constructor(props: GamesListProps) {
    super(props)
    this.state = props.gameNames.reduce((prev, key) => {
      prev[key] = []
      return prev
    }, {})
  }
  componentDidMount() {
    this.scheduleFetchRooms()
    this.active = true
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
    this.active = false
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

  scheduleFetchRooms() {
    if (this.active) {
      console.warn(`I'm aleady active!`)
      return
    }
    this.timerID = setTimeout(() => {
      if (!this.active) {
        return
      }
      this.props.gameNames.forEach(gameName => {
        this.props
          .getAvailableRooms(gameName)
          .then(rooms => {
            const newState = {}
            newState[gameName] = rooms
            this.setState(newState)
          })
          .catch(err => console.error(err))
          .finally(() => this.scheduleFetchRooms())
      })
    }, 1000)
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
