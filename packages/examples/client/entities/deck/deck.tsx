import React, { FunctionComponent, useState } from "react"
import "./deck.scss"
import { EntityWrapper, EntityViewProps } from "../entityWrapper/entityWrapper"
import { ParentWrapper } from "../parentWrapper/parentWrapper"

interface DeckProps extends EntityViewProps {}

export const Deck: FunctionComponent<DeckProps> = props => {
  return (
    <EntityWrapper className="deck entity--container" {...props}>
      <ParentWrapper parentData={props} />
    </EntityWrapper>
  )
}
