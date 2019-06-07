import React, { FunctionComponent } from "react"
// import "./pile.scss"
import { EntityWrapper, EntityProps } from "../entityWrapper/entityWrapper"
import {
  ParentWrapper,
  ParentWrapperProps
} from "../parentWrapper/parentWrapper"

interface PileProps extends ParentWrapperProps, EntityProps {}

const Pile: FunctionComponent<PileProps> = props => {
  return (
    <EntityWrapper className="pile entity--container" {...props}>
      <ParentWrapper data={props} />
    </EntityWrapper>
  )
}

export { Pile }
