import React, { FunctionComponent, useState } from "react"
import "./button.scss"

interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  noPadding?: boolean
  square?: boolean
  fontSize?: string
  className?: string
  style?: React.CSSProperties
}

export const Button: FunctionComponent<ButtonProps> = props => {
  const classes = []
  if (props.noPadding) {
    classes.push("noPadding")
  }
  if (props.square) {
    classes.push("square")
  }
  const styles: React.CSSProperties = { ...props.style }
  if (props.fontSize) {
    styles.fontSize = props.fontSize
  }

  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => props.onClick()}
      className={classes.join(" ")}
      style={styles}
    >
      {props.children}
    </button>
  )
}
