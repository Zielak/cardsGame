import React, { FunctionComponent } from "react"
import "./entity.scss"

export interface EntityViewProps {
  type?: string

  x?: number
  y?: number
  angle?: number
  width?: number
  height?: number
}

interface EntityProps extends EntityViewProps {
  className?: string
}

export const EntityWrapper: FunctionComponent<EntityProps> = props => {
  const translate = `translate(${props.x || 0}rem, ${props.y || 0}rem)`
  const rotate = props.angle ? `rotate(${props.angle}deg)` : ""

  return (
    <div
      className={`entity ${props.className}`}
      style={{
        left: `${props.x}rem`,
        top: `${props.y}rem`,
        transform: `${rotate}`,
        width: `${props.width}rem`,
        height: `${props.height}rem`
      }}
    >
      {props.children}
    </div>
  )
}
