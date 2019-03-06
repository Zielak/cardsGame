import { Graphics, Text, TextStyle } from "pixi.js"
import { cm2px } from "@cardsgame/utils"
import { EntityView } from "./entityView"
import { logs } from "../logs"
import { ClientEntityData, AttributeChangeData } from "../types"

export class ClassicCardView extends EntityView {
  paper: Graphics
  back: Graphics
  rank: Text
  suit: Text
  _idx: Text

  visibleToClient = false

  _privateAttributes: string[]

  constructor(data: ClientEntityData) {
    super(data)

    this._privateAttributes = ["name", "suit", "rank"]

    this.paper = new Graphics()
      .beginFill(0xffffff, 1)
      .lineStyle(1, 0xb7b7b7)
      .drawRoundedRect(
        -ClassicCardView.width / 2,
        -ClassicCardView.height / 2,
        ClassicCardView.width,
        ClassicCardView.height,
        8
      )

    // Back side graphics padding from paper's edge
    const BACK_PAD = 14
    const BACK_COLOR = 0xb0342f

    this.back = new Graphics()
      .beginFill(BACK_COLOR, 1)
      .drawRect(
        -ClassicCardView.width / 2 + BACK_PAD,
        -ClassicCardView.height / 2 + BACK_PAD,
        ClassicCardView.width - BACK_PAD * 2,
        ClassicCardView.height - BACK_PAD * 2
      )
      .endFill()
      .lineStyle(1, BACK_COLOR)
      .drawRect(
        -ClassicCardView.width / 2 + BACK_PAD - 2,
        -ClassicCardView.height / 2 + BACK_PAD - 2,
        ClassicCardView.width - BACK_PAD * 2 + 4,
        ClassicCardView.height - BACK_PAD * 2 + 4
      )

    this.rank = new Text(
      getRankText(this.data.rank),
      getRankStyle(this.data.rank)
    )
    this.rank.x = -ClassicCardView.width / 2 + 5
    this.rank.y = -ClassicCardView.height / 2 + 5

    this.suit = new Text(
      getSuitText(this.data.suit),
      getSuitStyle(this.data.suit)
    )
    this.suit.x = -ClassicCardView.width / 2 + 5
    this.suit.y = -ClassicCardView.height / 2 - 5 + this.rank.height

    this._idx = new Text(
      `(${this.data.idx})`,
      new TextStyle({
        fill: "#000000",
        fontSize: 12
      })
    )
    this._idx.x = -this._idx.width / 2

    this.addChild(this.paper)
    this.addChild(this.rank)
    this.addChild(this.suit)
    this.addChild(this.back)
    this.addChild(this._idx)

    this.data.faceUp && this.data.visibleToPublic ? this.show() : this.hide()

    // -------

    this.on("attributeChanged", (change: AttributeChangeData) => {
      switch (change.name) {
        case "marked":
          break
        case "rotated":
          break
        case "rank":
          this.renderRank(change.value)
          break
        case "suit":
          this.renderSuit(change.value)
          break
      }
      // If either of these got here, then it means this card
      // is visible to current client
      const cardVisibleToClient = this._privateAttributes.some(key => {
        return this.data[key] !== undefined
      })
      if (cardVisibleToClient) {
        this.show()
      } else if (this.data.visibleToPublic) {
        this.show()
      } else {
        this.data.faceUp ? this.show() : this.hide()
      }

      this.renderSelected(this.data.selected)
    })
  }

  private renderRank(rank: string) {
    this.rank.text = getRankText(rank)
    this.rank.style = getRankStyle(rank)
  }

  private renderSuit(suit: string) {
    this.suit.text = getSuitText(suit)
    this.suit.style = getSuitStyle(suit)
  }

  private show() {
    if (this.visibleToClient) return
    logs.verbose(`Card ${this.data.name}`, "showing")
    this.visibleToClient = true
    this.rank.visible = true
    this.suit.visible = true
    this.back.visible = false
  }

  private hide() {
    if (!this.visibleToClient) return
    logs.verbose(`Card ${this.data.name}`, "hiding")
    this.visibleToClient = false
    this.rank.visible = false
    this.suit.visible = false
    this.back.visible = true
  }

  private renderSelected(value: boolean) {
    if (value) {
      this.y = this.data.y - cm2px(2)
    } else {
      this.y = this.data.y
    }
  }

  static width = cm2px(6.35)
  static height = cm2px(8.89)
}

const getRankText = (rank: string): string => {
  return rank
}

const getSuitText = (suit: string): string => {
  switch (suit) {
    case "D":
      return "♦"
    case "C":
      return "♣"
    case "H":
      return "♥"
    case "S":
      return "♠"
  }
  return ""
}

const getRankStyle = _ => {
  return new TextStyle({
    fill: "#000000"
  })
}

const getSuitStyle = (suit: string) => {
  const style = new TextStyle({
    fontSize: 32
  })
  switch (suit) {
    case "H":
      style.fill = ["#ff6666", "#ff0000"]
      break
    case "D":
      style.fill = ["#66ccff", "#0066ff"]
      break
    case "C":
      style.fill = ["#33dd33", "#00aa00"]
      break
    case "S":
      style.fill = ["#666666", "#000000"]
      break
    default:
      style.fill = "#000000"
  }
  return style
}
