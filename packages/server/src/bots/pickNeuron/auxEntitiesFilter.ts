import { isEntityActionDefinition } from "../../actions/entity/utils.js"
import { Conditions } from "../../conditions/conditions.js"
import { BotEntityAuxContext } from "../../conditions/context/botEntityAux.js"
import { queryRunner } from "../../queries/runner.js"
import type { State } from "../../state/state.js"
import type { ChildTrait } from "../../traits/child.js"
import type { BotNeuron } from "../botNeuron.js"

/**
 * Grabs entities, which could become given neuron's interaction target
 */
export const auxillaryEntitiesFilter =
  <S extends State>(state: S, { action, entitiesFilter }: BotNeuron<S>) =>
  (entity: ChildTrait): boolean => {
    if (!action || !isEntityActionDefinition(action)) {
      // `getNeuronsAvailableEvents()` already ensures this action is of entities...
      return true
    } else if (Array.isArray(entitiesFilter)) {
      return entitiesFilter.some((query) => queryRunner(query)(entity))
    } else if (typeof entitiesFilter === "function") {
      const context: BotEntityAuxContext<S> = {
        state,
        variant: state.variantData,
        entity,
      }

      const con = new Conditions<BotEntityAuxContext<S>>(context, "entity")

      try {
        entitiesFilter(con, context)
      } catch (e) {
        return false
      }
    }
    return true
  }
