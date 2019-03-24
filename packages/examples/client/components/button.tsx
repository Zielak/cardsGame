import React, { FunctionComponent, useState } from "react"
import "./button.scss"

interface ButtonProps {
  onClick: () => void
  noPadding?: boolean
  square?: boolean
  fontSize?: string
}

export const Button: FunctionComponent<ButtonProps> = props => {
  const classes = []
  if (props.noPadding) {
    classes.push("noPadding")
  }
  if (props.square) {
    classes.push("square")
  }
  const styles: React.CSSProperties = {}
  if (props.fontSize) {
    styles.fontSize = props.fontSize
  }

  return (
    <button
      type="button"
      onClick={() => props.onClick()}
      className={classes.join(" ")}
      style={styles}
    >
      {props.children}
    </button>
  )
}
