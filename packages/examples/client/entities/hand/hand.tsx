import React, { FunctionComponent, useState } from "react"
import "./deck.scss"
import { EntityWrapper, EntityViewProps } from "../entityWrapper/entityWrapper"
import { ParentWrapper } from "../parentWrapper/parentWrapper"

interface HandProps extends EntityViewProps {}

export const Hand: FunctionComponent<HandProps> = props => {
  return (
    <EntityWrapper className="hand" {...props}>
      <ParentWrapper parentData={props} />
    </EntityWrapper>
  )
}
