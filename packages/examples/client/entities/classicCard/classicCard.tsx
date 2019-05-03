import React, { FunctionComponent, useState } from "react"
import { IEntityView } from "../traits"
import "./classicCard.scss"
import { cm2px } from "@cardsgame/utils"

interface ClassicCardProps extends IEntityView {
  faceUp: boolean
  suit: string
  rank: string
}

const CARD_WIDTH = cm2px(6.35)
const CARD_HEIGHT = cm2px(8.89)

export const ClassicCardView: FunctionComponent<ClassicCardProps> = props => {
  return (
    <div
      className="classicCard"
      style={{
        left: -CARD_WIDTH / 2 + "px",
        top: -CARD_HEIGHT / 2 + "px",
        transform: `translate(${props.x}px, ${props.x}px) rotate(${
          props.angle
        }deg)`,
        width: CARD_WIDTH + "px",
        height: CARD_HEIGHT + "px"
      }}
    >
      <div className="classicCard__paper" />
    </div>
  )
}
