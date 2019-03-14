import { Game, Room } from "@cardsgame/client"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList"
import { StateView } from "./components/stateView"

const game = new Game({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest"]
})

interface AppProps {
  gameRef: Game
}
interface AppState {
  gameState: any
}

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      gameState: {}
    }
  }
  componentDidMount() {
    this.props.gameRef.on(Room.events.stateChange, gameState =>
      this.setState({ gameState })
    )
  }
  render() {
    return (
      <div>
        <GamesList
          getAvailableRooms={game.getAvailableRooms.bind(game)}
          joinRoom={game.joinRoom.bind(game)}
          gameNames={game.gameNames}
        />
        <StateView state={this.state.gameState} />
      </div>
    )
  }
}

game.on(Game.events.clientOpen, () => {
  const element = <App gameRef={game} />
  ReactDOM.render(element, document.getElementById("root"))
})

window["game"] = game
