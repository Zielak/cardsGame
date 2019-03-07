import { Game } from "@cardsgame/client"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList"

const game = new Game({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest"]
})

game.on(Game.events.clientOpen, () => {
  const element = (
    <GamesList
      getAvailableRooms={gameName => game.getAvailableRooms(gameName)}
      joinRoom={gameName => game.joinRoom(gameName)}
      gameNames={game.gameNames}
    />
  )
  ReactDOM.render(element, document.getElementById("gamesList"))
})

window["game"] = game
