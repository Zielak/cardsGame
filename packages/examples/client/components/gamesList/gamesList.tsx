import React, { FunctionComponent, useState, useEffect } from "react"
import { RoomAvailable } from "@cardsgame/client"
import "./gamesList.scss"

export interface GamesListProps {
  joinRoom(gameName: string): any
  getAvailableRooms(gameName: string): Promise<RoomAvailable[]>
  gameNames: string[]
}

export const GamesList: FunctionComponent<GamesListProps> = props => {
  const [gameRooms, setGameRooms] = useState(
    props.gameNames.reduce((prev, key) => {
      prev[key] = []
      return prev
    }, {})
  )

  useEffect(() => {
    let timerID: NodeJS.Timeout

    const scheduleFetchRooms = () => {
      timerID = setTimeout(() => {
        Promise.all(props.gameNames.map(g => props.getAvailableRooms(g)))
          .then(rooms => {
            setGameRooms(
              rooms.reduce((prev, room, idx) => {
                prev[props.gameNames[idx]] = room
                return prev
              }, {})
            )
          })
          .catch(err => {
            console.error(err)
          })
          .then(() => scheduleFetchRooms())
      }, 1000)
    }

    scheduleFetchRooms()

    return () => {
      clearTimeout(timerID)
    }
  }, [])

  return (
    <aside className="GamesList">
      <h2>Games list</h2>
      {props.gameNames.map((gameName, idx) => {
        return (
          <GameSection
            key={idx + gameName}
            title={gameName}
            rooms={gameRooms[gameName]}
            joinRoom={props.joinRoom}
          />
        )
      })}
    </aside>
  )
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
      <header>{props.title}</header>
      <button
        type="button"
        className="join"
        onClick={() => props.joinRoom(props.title)}
      >
        Join
      </button>
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
