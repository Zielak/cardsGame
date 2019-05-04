import React, { FunctionComponent, useState } from "react"
import "./sidePanel.scss"
import { Button } from "../button/button"

export const SidePanel: FunctionComponent = props => {
  const [collapsed, setCollapsed] = useState(false)

  const classNames = ["sidePanel", collapsed ? "--collapsed" : ""]

  return (
    <aside className={classNames.join(" ")}>
      <Button
        style={{
          lineHeight: 0.4,
          position: "absolute",
          left: "-1em"
        }}
        square={true}
        fontSize="1.4rem"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "+" : "-"}
      </Button>
      {props.children}
    </aside>
  )
}
