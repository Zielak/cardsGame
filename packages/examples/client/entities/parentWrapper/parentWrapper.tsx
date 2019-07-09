import React, { FunctionComponent } from "react"
import "./parentWrapper.scss"
import { ClassicCardView } from "../classicCard/classicCard"
import { Deck } from "../deck/deck"
import { Hand } from "../hand/hand"
import { Pile } from "../pile/pile"
import { SplendorCardView } from "../splendorCard/splendorCard"

export interface ParentWrapperProps {
  data: any
}

export const containersParents = [
  "childrenPile",
  "childrenDeck",
  "childrenHand"
]
export const containersChildren = ["childrenClassicCard"]

const ParentWrapper: FunctionComponent<ParentWrapperProps> = props => {
  return (
    <div className="parentWrapper">
      {props.children}
      {...getChildren(props.data.children, props.data.idxPath, "")}
    </div>
  )
}

export { ParentWrapper }

const getChildren = (children = [], idxPath = [], thisName = "") => {
  console.log(`\t\t${thisName}.RENDER()`, children)

  return [...children]
    .sort((a, b) => a.idx - b.idx)
    .map(childData => {
      childData.idxPath = [...idxPath, childData.idx]
      return childData
    })
    .map((childData, idx) => {
      switch (childData.type) {
        case "classicCard":
          return <ClassicCardView key={"card" + childData.idx} {...childData} />
        case "deck":
          return <Deck key={"deck" + childData.idx} {...childData} />
        case "hand":
          return <Hand key={"hand" + childData.idx} {...childData} />
        case "pile":
          return <Pile key={"pile" + childData.idx} {...childData} />
        // TODO: probably inherit from the game types automatically
        case "splendorCard":
          return (
            <SplendorCardView
              key={"splendorCard" + childData.idx}
              {...childData}
            />
          )
        default:
          return (
            <p key={"default" + idx}>Whoops: {JSON.stringify(childData)}</p>
          )
      }
    })
}
