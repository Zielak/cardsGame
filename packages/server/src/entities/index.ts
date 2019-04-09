import { IState } from "../state"
import { IEntityOptions, Entity, IEntityImplementation } from "./entity"
import { Pile, IPileOptions } from "./pile"
import { Hand, IHandOptions } from "./hand"
import { Deck } from "./deck"
import { ClassicCard, IClassicCardOptions } from "./classicCard"
import { BaseCard, IBaseCardOptions } from "./baseCard"

const create = (
  state: IState,
  implementation: IEntityImplementation,
  options: any
) => {
  const entity = new Entity({ state, ...options })
  Object.defineProperties(entity, {
    ...implementation(entity, options)
  })
  return entity
}

export const factory = (state: IState) => ({
  baseCard: (options: IBaseCardOptions) => create(state, BaseCard, options),
  classicCard: (options: IClassicCardOptions) =>
    create(state, ClassicCard, options),
  deck: (options: IEntityOptions) => create(state, Deck, options),
  hand: (options: IHandOptions) => create(state, Hand, options),
  pile: (options: IPileOptions) => create(state, Pile, options)
})

// TODO: Maybe export only types?
