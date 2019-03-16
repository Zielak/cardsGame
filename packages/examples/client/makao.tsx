import React, { FunctionComponent, useState } from "react"
import { Game } from "@cardsgame/client"
import { RankPicker } from "./components/rankPicker"
import { Button } from "./components/button"

interface MakaoGameUIProps {
  gameRef: Game
  gameState: MakaoGameState
}

export const MakaoGameUI: FunctionComponent<MakaoGameUIProps> = props => {
  const [rankPickerActive, setRankPickerActive] = useState(false)

  const sendPass = () => {
    props.gameRef.send({})
  }

  const children = []

  if (props.gameState.requestedRank) {
    children.push(
      <RankPicker
        key="RankPicker"
        visible={rankPickerActive}
        handleRankChosen={value => {
          props.gameRef.send({
            data: {
              // TODO: there's currently no way to program
              // UI interaction, buttons etc
              type: "UI.button"
            }
          })
        }}
      />
    )
  }
  if (props.gameState.skipPoints > 0) {
    children.push(<Button key="PassButton" label="PASS" onClick={sendPass} />)
  }
  return <>{...children}</>
}

interface MakaoGameState {
  atackPoints: number
  skipPoints: number
  requestedSuit: string
  requestedRank: string
  turnSkips: {
    [key: string]: number
  }
}
