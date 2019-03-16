import React, { FunctionComponent, useState } from "react"

interface ButtonProps {
  label: string
  onClick: () => void
}

export const Button: FunctionComponent<ButtonProps> = props => {
  return (
    <button type="button" onClick={() => props.onClick()}>
      {props.label}
    </button>
  )
}
