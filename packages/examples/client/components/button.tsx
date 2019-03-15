import * as React from "react"

interface ButtonProps {
  label: string
  onClick: () => void
}

export class Button extends React.Component<ButtonProps, {}> {
  render() {
    return (
      <button type="button" onClick={() => this.props.onClick()}>
        {this.props.label}
      </button>
    )
  }
}
