import { isEntityActionDefinition } from "../../actions/entityAction.js"
import { queryRunner } from "../../queries/runner.js"
import type { State } from "../../state/state.js"
import type { ChildTrait } from "../../traits/child.js"
import type { BotNeuron } from "../botNeuron.js"
import { EntityConditions } from "../conditions.js"

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
      const con = new EntityConditions<S>(state, { entity }, "entity")
      try {
        entitiesFilter(con)
      } catch (e) {
        return false
      }
    }
    return true
  }
