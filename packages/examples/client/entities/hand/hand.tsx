import React, { FunctionComponent } from "react"
import "./hand.scss"
import { EntityWrapper, EntityProps } from "../entityWrapper/entityWrapper"
import {
  ParentWrapper,
  ParentWrapperProps
} from "../parentWrapper/parentWrapper"

interface HandProps extends ParentWrapperProps, EntityProps {}

const Hand: FunctionComponent<HandProps> = props => {
  return (
    <EntityWrapper className="hand entity--container" {...props}>
      <ParentWrapper data={props} />
    </EntityWrapper>
  )
}

export { Hand }
