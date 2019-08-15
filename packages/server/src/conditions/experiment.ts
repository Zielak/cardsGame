import { find, getChildren } from "../traits"
import { QuerableProps } from "../traits/parent"
import { State } from "../state"
import { MakaoState } from "../../../../../cardsGame-examples/server/makao/state"
import { ServerPlayerEvent } from "../player"

type MakaoAssertion<S extends State> = {
  atWar: () => Con<S>
}

const con = new Con<MakaoState>(
  {},
  {},
  {
    atWar: function(this: Con<MakaoState>) {
      if (this.getState().atackPoints <= 0) {
        throw new Error(
          `atWar | nope, atackPoints = ${this.getState().atackPoints}`
        )
      }

      return this
    }
    // matchRank: function(this: Con<MakaoState>, values: string | string[]) {
    //   const arr = Array.isArray(values) ? values : [values]

    //   this._subject.every()
    // }
  }
) as Con<MakaoState> & MakaoAssertion<MakaoState>

const SelectCard = () => {}

const DeselectCard = () => {
  con.is.playersTurn.and.is.owner
}

const Atack23 = () => {}

const AtackKing = () => {}

const PlaySkipTurn = () => {}

const PassTurn = () => {}

const PlayAce = () => {}

const RequestSuit = () => {}

const PlayJack = () => {}

const RequestRank = () => {}

const PlayNormalCards = () => {}

const DrawCards = () => {}
