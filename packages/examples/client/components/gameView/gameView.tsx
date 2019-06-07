import React, { FunctionComponent } from "react"

import "./gameView.scss"
import { ParentWrapper } from "../../entities/parentWrapper/parentWrapper"
import { Table } from "../../entities/table/table"
import { IGameState } from "../../app"

interface GameViewProps {
  gameState: IGameState
}

const GameView: FunctionComponent<GameViewProps> = props => {
  return (
    <section className="gameView">
      <ParentWrapper data={props.gameState}>
        <Table
          width={props.gameState.tableWidth}
          height={props.gameState.tableHeight}
        />
      </ParentWrapper>
    </section>
  )
}

export { GameView }
