import React, { FunctionComponent, useState, useEffect } from "react"
import "./collapsablePanel.scss"
import { Button } from "../button/button"

interface CollapsablePanelProps {
  name: string
  expandedDefault?: boolean
}

export const CollapsablePanel: FunctionComponent<
  CollapsablePanelProps
> = props => {
  const [expanded, setExpanded] = useState(true)

  const classNames = [
    "collapsablePanel",
    expanded ? "collapsablePanel--collapsed" : ""
  ]

  return (
    <section className={classNames.join(" ")}>
      <header>
        <h3>{props.name}</h3>
        <Button
          style={{
            lineHeight: 0.4
          }}
          square={true}
          fontSize="1.4em"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "v" : "^"}
        </Button>
      </header>
      <div className="collapsablePanel__content">{props.children}</div>
    </section>
  )
}
