import React, { FunctionComponent, useState } from "react"
import "./gameView.scss"
import { ParentWrapper } from "../../entities/parentWrapper/parentWrapper"
import { Table } from "../../entities/table/table"

interface GameViewProps {
  state: { [key: string]: any }
}

export const GameView: FunctionComponent<GameViewProps> = props => {
  document.documentElement.style.setProperty("font-size", "1px")

  return (
    <section className="gameView">
      <ParentWrapper parentData={props.state}>
        <Table
          width={props.state.tableWidth}
          height={props.state.tableHeight}
        />
      </ParentWrapper>
    </section>
  )
}
