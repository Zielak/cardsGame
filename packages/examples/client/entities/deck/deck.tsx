import React, { FunctionComponent, useState } from "react"
import "./deck.scss"
import { EntityWrapper, EntityViewProps } from "../entityWrapper"
import { ParentWrapper } from "../parentWrapper"

interface DeckProps extends EntityViewProps {}

export const Deck: FunctionComponent<DeckProps> = props => {
  return (
    <EntityWrapper className="deck" {...props}>
      <ParentWrapper parentData={props} />
    </EntityWrapper>
  )
}
