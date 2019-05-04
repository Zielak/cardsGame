import React, { FunctionComponent, useState } from "react"
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  ClassicCardView
} from "./classicCard/classicCard"
import { Deck } from "./deck/deck"
import "./parentWrapper.scss"

interface ParentProps {
  parentData: { [key: string]: any }
}

const getChildren = state =>
  ["childrenClassicCard", "childrenPile", "childrenDeck", "childrenHand"]
    .filter(key => state[key] && state[key].length > 0)
    .reduce((prev, key) => prev.concat(state[key]), [])
    .sort((a, b) => a.idx - b.idx)
    .map(childData => {
      switch (childData.type) {
        case "classicCard":
          return <ClassicCardView key={"card" + childData.idx} {...childData} />
        case "deck":
          return <Deck key={"deck" + childData.idx} {...childData} />
      }
    })

export const ParentWrapper: FunctionComponent<ParentProps> = props => {
  return <div className="parentWrapper">{...getChildren(props.parentData)}</div>
}
