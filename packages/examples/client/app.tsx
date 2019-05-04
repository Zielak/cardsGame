import { Game, Room } from "@cardsgame/client"
import React, { FunctionComponent, useState, useEffect } from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList/gamesList"
import { MakaoGameUI } from "./games/makao/makao"
import { StateView } from "./components/stateView/stateView"
import { SidePanel } from "./components/sidePanel/sidePanel"
import { GameView } from "./components/gameView/gameView"
import { Button } from "./components/button/button"
import { CollapsablePanel } from "./components/collapsablePanel/collapsablePanel"

const game = new Game({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest", "Splendor"]
})
game.room

interface IAppProps {
  gameRef: Game
}
export interface IGameState {
  currentPlayerIdx?: number
  isGameStarted?: boolean
  ui?: { [key: string]: string }
}

export const App: FunctionComponent<IAppProps> = props => {
  const [gameState, setGameState] = useState<IGameState>({})
  const [room, setRoom] = useState(undefined)

  const [currentGame, setCurrentGame] = useState("")

  useEffect(() => {
    const joinedRoomHandler = (gameName: string) => {
      console.info("joinedRoom")
      setCurrentGame(gameName)

      const room = props.gameRef.room

      room.on(Room.events.stateChange, newState => {
        setGameState({ ...newState })
      })
      room.on(Room.events.message, message => {})
    }
    props.gameRef.on(Game.events.joinedRoom, joinedRoomHandler)

    setRoom(room)

    return () => {
      props.gameRef.off(Game.events.joinedRoom, joinedRoomHandler)
    }
  }, [])

  const game = props.gameRef

  return (
    <>
      <GameView state={gameState} />

      {currentGame === "Makao" && (
        <MakaoGameUI gameRef={game} gameState={gameState} />
      )}

      <SidePanel>
        {!currentGame && <h3>Join some game!</h3>}
        {currentGame && (
          <>
            <div>Commands:</div>
            <section className="flex">
              <Button
                disabled={gameState.isGameStarted}
                onClick={() => game.send({ data: "start" })}
              >
                Start game
              </Button>
            </section>
            <CollapsablePanel name="State">
              <StateView data={gameState} root />
            </CollapsablePanel>
          </>
        )}
        <CollapsablePanel name="Games list" expandedDefault>
          <GamesList
            getAvailableRooms={game.getAvailableRooms.bind(game)}
            joinRoom={game.joinRoom.bind(game)}
            gameNames={game.gameNames}
          />
        </CollapsablePanel>
      </SidePanel>
    </>
  )
}

game.on(Game.events.clientOpen, () => {
  const element = <App gameRef={game} />
  ReactDOM.render(element, document.getElementById("root"))
})

window["game"] = game
