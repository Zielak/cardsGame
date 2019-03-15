import { Game, Room } from "@cardsgame/client"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { GamesList } from "./components/gamesList"
import { StateView } from "./components/stateView"
import { RankPicker } from "./components/rankPicker"

const game = new Game({
  viewElement: document.getElementById("view"),
  gameNames: ["Makao", "ContainerTest"]
})

interface AppProps {
  gameRef: Game
}
interface AppState {
  gameState: any
  rankPickerActive: boolean
}

class App extends React.Component<AppProps, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      gameState: {},
      rankPickerActive: false
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
        <RankPicker
          visible={this.state.rankPickerActive}
          handleRankChosen={value => {
            game.send({
              data: {
                // TODO: there's currently no way to program
                // UI interaction, buttons etc
                type: "UI.button"
              }
            })
          }}
        />
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
