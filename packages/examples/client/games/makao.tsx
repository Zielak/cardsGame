import React, { FunctionComponent, useState, useEffect } from "react"
import { Game } from "@cardsgame/client"
import { RankPicker } from "./rankPicker"
import { Button } from "../components/button"

interface MakaoGameUIProps {
  gameRef: Game
  gameState: MakaoGameState
}

export const MakaoGameUI: FunctionComponent<MakaoGameUIProps> = props => {
  const [rankPickerActive, setRankPickerActive] = useState(false)
  useEffect(() => {
    // setRankPickerActive(props.gameState.requestedRank)
  }, [props.gameState.requestedRank])

  const [suitPickerActive, setSuitPickerActive] = useState(false)

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
          props.gameRef.send({ data: { type: "UI.button" } })
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
