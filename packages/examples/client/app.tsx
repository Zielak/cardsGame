import { Game } from "@cardsgame/client"
import React, {
  FunctionComponent,
  useState,
  useEffect,
  createContext
} from "react"
import * as ReactDOM from "react-dom"

import { GamesList } from "./components/gamesList/gamesList"
import { MakaoGameUI } from "./games/makao/makao"
import { SidePanel } from "./components/sidePanel/sidePanel"
import { GameView } from "./components/gameView/gameView"
import { Button } from "./components/button/button"
import { CollapsablePanel } from "./components/collapsablePanel/collapsablePanel"
import { stateToJSON } from "./services/stateService"

import "./style.scss"

export const InteractionContext = createContext(
  (event: any, idxPath: number[]) => {}
)

interface IAppProps {
  // gameRef: Game
}
export interface IGameState {
  childrenData?: any[]

  currentPlayerIdx?: number
  isGameStarted?: boolean

  tableWidth?: number
  tableHeight?: number

  ui?: { [key: string]: string }
}

const App: FunctionComponent<IAppProps> = props => {
  const [game, setGame] = useState<Game>()
  const [clientConnected, setClientConnected] = useState(false)
  useEffect(() => {
    const game = new Game({
      viewElement: document.getElementById("view"),
      gameNames: ["ShuffleTest", "Makao", "ContainersTest", "Splendor"]
    })

    game.on(Game.events.clientOpen, () => {
      console.log("Client connected.")
      setClientConnected(true)
      window["game"] = game
    })

    setGame(game)
  }, [])

  const [currentGameName, setCurrentGameName] = useState("")

  const [gameState, setGameState] = useState(undefined)

  const handleStateChange = newState => {
    const copy = stateToJSON(newState)

    console.log("handleStateChange, copy:", copy)
    setGameState(copy)
  }

  const handleMessage = message => {}

  const requestJoinRoom = gameName => {
    if (!clientConnected) {
      console.warn(`You're not yet connected...`)
      return
    }
    const room = game.joinRoom(gameName)

    room.onJoin.addOnce(() => {
      console.info("handleJoinedRoom")

      room.onStateChange.add(handleStateChange)
      room.onMessage.add(handleMessage)

      setCurrentGameName(gameName)
    })
  }

  const handleInteraction = (event, idxPath) => {
    game.sendInteraction(event, idxPath)
  }

  return (
    <>
      {console.log("render")}
      {gameState && (
        <InteractionContext.Provider value={handleInteraction}>
          <GameView gameState={gameState} />
        </InteractionContext.Provider>
      )}

      {currentGameName === "Makao" && (
        <MakaoGameUI gameRef={game} gameState={gameState} />
      )}

      {clientConnected && (
        <SidePanel>
          {!currentGameName && <h3>Join some game!</h3>}
          {gameState && (
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
              {/* <CollapsablePanel name="State">
                <StateView data={gameState} root />
              </CollapsablePanel> */}
            </>
          )}
          <CollapsablePanel name="Games list" expandedDefault>
            <GamesList
              getAvailableRooms={game.getAvailableRooms.bind(game)}
              joinRoom={requestJoinRoom}
              gameNames={game.gameNames}
            />
          </CollapsablePanel>
        </SidePanel>
      )}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
