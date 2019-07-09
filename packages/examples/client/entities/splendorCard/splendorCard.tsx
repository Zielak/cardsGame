import React, { FunctionComponent } from "react"
import "./splendorCard.scss"
import { cm2px } from "@cardsgame/utils"
import { EntityProps, EntityWrapper } from "../entityWrapper/entityWrapper"

export interface SplendorCardProps extends EntityProps {
  faceUp: boolean
  level: number
  costD: number // White
  costS: number // Blue
  costE: number // Green
  costR: number // Red
  costO: number // Black
  gem: Gems
  vp: number
}

export const CARD_WIDTH = cm2px(6.35)
export const CARD_HEIGHT = cm2px(8.89)

const SplendorCardView: FunctionComponent<SplendorCardProps> = props => {
  return (
    <EntityWrapper
      className="splendorCard entity--object"
      {...{
        ...props,
        width: CARD_WIDTH,
        height: CARD_HEIGHT
      }}
    >
      <div className="splendorCard__paper" />
      {props.faceUp && (
        <div className="splendorCard__background">
          <div className="splendorCard__header">
            <div className="splendorCard__gem">{getGemIcon(props.gem)}</div>
            <div className="splendorCard__vp">{props.vp}</div>
          </div>
          <ul className="splendorCard__costs">{getCostsQuickie(props)}</ul>
        </div>
      )}
      {!props.faceUp && (
        <>
          <div
            className={`splendorCard__back splendorCard__back--${props.level}`}
          >
            <span className={`splendorCard__backLevel`}>{props.level}</span>
          </div>
        </>
      )}
    </EntityWrapper>
  )
}

export { SplendorCardView }

const getGemIcon = (gem: Gems): string => {
  switch (gem) {
    case Gems.Diamond:
      return "D"
    case Gems.Sapphire:
      return "S"
    case Gems.Emerald:
      return "E"
    case Gems.Ruby:
      return "R"
    case Gems.Onyx:
      return "O"
    // case Gems.Gold:
    //   return "G"
  }
  return "gem?"
}

const getCostsQuickie = (props: SplendorCardProps) => {
  const arr = [
    [getGemIcon(Gems.Diamond), props.costD],
    [getGemIcon(Gems.Emerald), props.costE],
    [getGemIcon(Gems.Onyx), props.costO],
    [getGemIcon(Gems.Ruby), props.costR],
    [getGemIcon(Gems.Sapphire), props.costS]
  ]
  return arr
    .filter(tuple => tuple[1] > 0)
    .map((tuple, idx) => (
      <li key={`consts${props.name}_${idx}`}>
        {tuple[0]}: {tuple[1]}
      </li>
    ))
}

enum Gems {
  Diamond,
  Sapphire,
  Emerald,
  Ruby,
  Onyx,
  Gold
}
