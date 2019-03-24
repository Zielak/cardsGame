import * as React from "react"
import { Button } from "../components/button"

export interface SuitPickerProps {
  handleSuitChosen: (string) => void
}

const suits = ["H", "S", "D", "C", null]
const labels = ["♥", "♠", "♦", "♣", "nothing"]

export class SuitPicker extends React.Component<SuitPickerProps, {}> {
  render() {
    return (
      <div>
        {suits.map((suitCode, idx) => (
          <Button
            key={`suitPickBtn${suitCode}`}
            onClick={() => this.props.handleSuitChosen(suitCode)}
            label={labels[idx]}
          />
        ))}
      </div>
    )
  }
}
