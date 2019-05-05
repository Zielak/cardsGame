import * as React from "react"
import { Button } from "../components/button/button"
import "./suitPicket.scss"

export interface SuitPickerProps {
  handleSuitChosen: (string) => void
}

const suits = ["H", "S", "D", "C", null]
const labels = ["♥", "♠", "♦", "♣", "﹡"]

export class SuitPicker extends React.Component<SuitPickerProps, {}> {
  render() {
    return (
      <div className="SuitPicker">
        Request some suit:
        {suits.map((suitCode, idx) => (
          <Button
            key={`suitPickBtn${suitCode}`}
            onClick={() => this.props.handleSuitChosen(suitCode)}
            square={true}
            noPadding={true}
            fontSize="2em"
          >
            <i className={suits[idx]}>{labels[idx]}</i>
          </Button>
        ))}
      </div>
    )
  }
}
