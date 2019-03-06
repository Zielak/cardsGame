import { App } from "@cardsgame/client"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList"

const app = new App({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest"]
})

app.on(App.events.clientOpen, () => {
  const element = (
    <GamesList
      getAvailableRooms={gameName => app.getAvailableRooms(gameName)}
      joinRoom={gameName => app.joinRoom(gameName)}
      gameNames={app.gameNames}
    />
  )
  ReactDOM.render(element, document.getElementById("gamesList"))
})

window["game"] = app
