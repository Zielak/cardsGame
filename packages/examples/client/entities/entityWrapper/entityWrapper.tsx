import React, { FunctionComponent, useContext } from "react"
import "./entity.scss"
import { decimal } from "@cardsgame/utils"
import { InteractionContext } from "../../app"

export interface EntityProps {
  className?: string

  idxPath: number[]
  type: string
  name: string

  x: number
  y: number
  angle: number
  width: number
  height: number
}

/**
 * @param props requires only props needed to place an Entity on the scene
 */
const EntityWrapper: FunctionComponent<EntityProps> = props => {
  const handleInteraction = useContext(InteractionContext)

  const translate = `translate(${decimal(props.x) || 0}rem, ${decimal(
    props.y
  ) || 0}rem)`
  const rotate = props.angle ? `rotate(${decimal(props.angle)}deg)` : ""

  const x = decimal(props.width ? props.x - props.width / 2 : props.x)
  const y = decimal(props.height ? props.y - props.height / 2 : props.y)

  const style = {
    left: `${x}rem`,
    top: `${y}rem`,
    transform: `${rotate}`,
    width: `${decimal(props.width)}rem`,
    height: `${decimal(props.height)}rem`
  }

  return (
    <div
      className={`entity ${props.className}`}
      style={style}
      onClick={event => {
        event.stopPropagation()
        handleInteraction(event, props.idxPath)
      }}
    >
      {props.children}
    </div>
  )
}

export { EntityWrapper }
