import * as React from "react"
import { Button } from "../components/button"

export interface SuitPickerProps {
  visible: boolean
  handleSuitChosen: (string) => void
}

const suits = ["♥", "♠", "♦", "♣", null]

export class SuitPicker extends React.Component<SuitPickerProps, {}> {
  render() {
    return (
      <div className={this.props.visible ? "" : "hidden"}>
        {suits.map(el => (
          <Button
            key={`suitPickBtn${el}`}
            onClick={() => this.props.handleSuitChosen(el)}
            label={el === null ? "nothing" : el}
          />
        ))}
      </div>
    )
  }
}
