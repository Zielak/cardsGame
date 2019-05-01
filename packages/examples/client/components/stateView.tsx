import * as React from "react"
import { IGameState } from "../app"

export interface StateViewProps {
  state: IGameState
}
export class StateView extends React.Component<StateViewProps, {}> {
  render() {
    function replacer(key, value) {
      if (key === "") {
        return value
      }
      // Filtering out properties
      if (key === "entities" || key === "players") {
        return `${key}: ${Object.keys(value).length}`
      }
      return value
    }
    return (
      <pre>
        <code>{JSON.stringify(this.props.state, replacer, "  ")}</code>
      </pre>
    )
  }
}
