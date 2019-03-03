import React from "react";
import "./gamesList.scss";
export class GamesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.gameNames.reduce((prev, key) => {
            prev[key] = [];
            return prev;
        }, {});
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.props.gameNames.forEach(gameName => {
            this.props.getAvailableRooms(gameName, (rooms, err) => {
                if (err) {
                    console.error(err);
                }
                const newState = {};
                newState[gameName] = rooms;
                this.setState(newState);
            });
        }), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    render() {
        return (<aside>
        {this.props.gameNames.map((gameName, idx) => {
            return (<GameSection key={idx + gameName} title={gameName} rooms={this.state[gameName]} joinRoom={this.props.joinRoom}/>);
        })}
      </aside>);
    }
}
const GameSection = (props) => {
    const rooms = props.rooms.map(room => (<li key={room.roomId}>
      <strong>{room.roomId} </strong>({room.clients}/{room.maxClients})
    </li>));
    return (<section>
      <header>
        {props.title}
        <button type="button" className="join" onClick={() => props.joinRoom(props.title)}>
          Join
        </button>
      </header>
      <ol>{rooms}</ol>
    </section>);
};
//# sourceMappingURL=gamesList.js.map