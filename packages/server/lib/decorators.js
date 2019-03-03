export { nosync } from "colyseus";
import { EntityEvents } from "@cardsgame/utils";
export function condvis(target, key) {
    Object.defineProperty(target, key, {
        get: function () {
            // State doesn't need to know of this props existance
            return undefined;
        },
        set: function (val) {
            const entity = this;
            // Now it will be visible by the state?
            // For how long? Is it?
            Object.defineProperty(this, key, {
                value: val,
                writable: true,
                enumerable: false,
                configurable: true
            });
            // Emits single private attribute update change
            if (entity._visibilityData.shouldSendToEveryone(key)) {
                this.emit.call(this, EntityEvents.sendPropToEveryone, key);
            }
            if (entity._visibilityData.shouldSendToOwner(key)) {
                this.emit.call(this, EntityEvents.sendPropToOwner, key);
            }
        },
        enumerable: false
    });
}
//# sourceMappingURL=decorators.js.map