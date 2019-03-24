import { Game, Room } from "@cardsgame/client"
import React, { FunctionComponent, useState, useEffect } from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList"
import { StateView } from "./components/stateView"
import { MakaoGameUI } from "./games/makao"

const game = new Game({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest", "Splendor"]
})

interface AppProps {
  gameRef: Game
}
interface AppState {
  gameState: any
}

export const App: FunctionComponent<AppProps> = props => {
  const [gameState, setGameState] = useState({})

  const [currentRoomElement, setCurrentRoomElement] = useState()

  useEffect(() => {
    const joinedRoomHandler = () => {
      console.info("joinedRoom")
      // Every time we join a game, listen differently
      const room = props.gameRef.room
      room.on(Room.events.stateChange, gameState => {
        setGameState(gameState)
      })
      room.on(Room.events.message, message => {})
    }
    props.gameRef.on(Game.events.joinedRoom, joinedRoomHandler)

    return () => {
      props.gameRef.off(Game.events.joinedRoom, joinedRoomHandler)
    }
  }, [])

  const game = props.gameRef

  return (
    <div>
      <MakaoGameUI gameRef={game} gameState={gameState} />
      <GamesList
        getAvailableRooms={game.getAvailableRooms.bind(game)}
        joinRoom={game.joinRoom.bind(game)}
        gameNames={game.gameNames}
      />
      <StateView state={gameState} />
    </div>
  )
}

game.on(Game.events.clientOpen, () => {
  const element = <App gameRef={game} />
  ReactDOM.render(element, document.getElementById("root"))
})

window["game"] = game
