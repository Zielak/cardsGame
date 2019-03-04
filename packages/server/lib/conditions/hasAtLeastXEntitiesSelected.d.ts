import { ICondition } from "../condition";
/**
 * Expects the current player to have at least `count` selected entities.
 * Function returns an actual `Condition`
 * @param count X
 */
export declare const hasAtLeastXEntitiesSelected: (count: number) => ICondition;
