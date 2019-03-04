import { State } from "./state";
import { ServerPlayerEvent } from "./player";
export interface ICondition {
    (state: State, event: ServerPlayerEvent): boolean;
}
export declare type IConditionFactory = (...args: any) => ICondition;
