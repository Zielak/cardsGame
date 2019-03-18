import { Game, Room } from "@cardsgame/client"
import * as React from "react"
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

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      gameState: {}
    }
  }
  componentDidMount() {
    const game = this.props.gameRef
    game.on(Room.events.stateChange, gameState => {
      this.setState({ gameState })
    })
    game.on(Room.events.message, message => {})
  }
  render() {
    const game = this.props.gameRef
    return (
      <div>
        <MakaoGameUI gameRef={game} gameState={this.state.gameState} />
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
