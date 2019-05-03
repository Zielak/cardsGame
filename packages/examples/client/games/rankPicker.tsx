import * as React from "react"
import { Button } from "../components/button/button"

export interface RankPickerProps {
  visible: boolean
  handleRankChosen: (string) => void
}

// Disable what you won't be able to request with Jack
const ranks = ["5", "6", "7", "8", "9", "10", "Q", null]

export class RankPicker extends React.Component<RankPickerProps, {}> {
  render() {
    return (
      <div className={this.props.visible ? "" : "hidden"}>
        {ranks.map(el => (
          <Button
            key={`rankPickBtn${el}`}
            onClick={() => this.props.handleRankChosen(el)}
            label={el === null ? "nothing" : el}
          />
        ))}
      </div>
    )
  }
}
