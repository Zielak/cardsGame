import React, { FunctionComponent, useState, CSSProperties } from "react"
import "./classicCard.scss"
import { cm2px } from "@cardsgame/utils"
import { EntityViewProps, EntityWrapper } from "../entityWrapper/entityWrapper"

interface ClassicCardProps extends EntityViewProps {
  faceUp: boolean
  suit: string
  rank: string
}

export const CARD_WIDTH = cm2px(6.35)
export const CARD_HEIGHT = cm2px(8.89)

export const ClassicCardView: FunctionComponent<ClassicCardProps> = props => {
  return (
    <EntityWrapper
      className="classicCard"
      {...{
        ...props,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
      }}
    >
      <div className="classicCard__paper" />
      {props.faceUp && (
        <>
          <div className="classicCard__symbols">
            <span className="classicCard__rank">{getRankText(props.rank)}</span>
            <br />
            <span
              className={`classicCard__suit classicCard__suit--${props.suit}`}
            >
              {getSuitText(props.suit)}
            </span>
          </div>
          <div className="classicCard__symbols classicCard__symbols--inverted">
            <span className="classicCard__rank">{getRankText(props.rank)}</span>
            <br />
            <span
              className={`classicCard__suit classicCard__suit--${props.suit}`}
            >
              {getSuitText(props.suit)}
            </span>
          </div>
        </>
      )}
      {!props.faceUp && (
        <>
          <div className="classicCard__back" />
        </>
      )}
    </EntityWrapper>
  )
}

const getRankText = (rank: string): string => {
  return rank
}

const getSuitText = (suit: string): string => {
  switch (suit) {
    case "D":
      return "♦"
    case "C":
      return "♣"
    case "H":
      return "♥"
    case "S":
      return "♠"
  }
  return ""
}
