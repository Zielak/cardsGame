import React, { FunctionComponent, useState } from "react"
import "./hand.scss"
import { EntityWrapper, EntityViewProps } from "../entityWrapper/entityWrapper"
import { ParentWrapper } from "../parentWrapper/parentWrapper"

interface HandProps extends EntityViewProps {}

export const Hand: FunctionComponent<HandProps> = props => {
  return (
    <EntityWrapper className="hand entity--container" {...props}>
      <ParentWrapper parentData={props} />
    </EntityWrapper>
  )
}
