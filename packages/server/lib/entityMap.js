var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nosync } from "colyseus";
import { Entity } from "./entity";
import { EntityEvents } from "@cardsgame/utils";
import { logs } from "./logs";
export class EntityMap {
    add(entity) {
        const idx = this.length;
        this[idx] = entity;
        return idx;
        // notifyNewIdx(entity, idx)
    }
    remove(_idx) {
        const idx = typeof _idx === "number" ? _idx : parseInt(_idx);
        if (typeof this[idx] === "undefined") {
            return false;
        }
        notifyNewIdx(this[idx], undefined);
        delete this[idx];
        this.updateOrder();
        return true;
    }
    /**
     * Makes sure that every child is at its own
     * unique 'idx' value, starting with 0
     */
    updateOrder() {
        const keys = Object.keys(this);
        keys.forEach((_key, idx) => {
            const key = parseInt(_key);
            if (key === idx)
                return;
            // We've got empty space right here
            if (this[idx] === undefined) {
                this[idx] = this[key];
                delete this[key];
                notifyNewIdx(this[idx], idx);
            }
            else {
                this[idx] = this[key];
                notifyNewIdx(this[idx], idx);
                throw new Error(`I don't know how that happened to be honest`);
            }
        });
        return this;
    }
    toArray() {
        const arr = [];
        for (let key in this) {
            arr.push(this[key]);
        }
        return arr;
    }
    get length() {
        return Object.keys(this).length;
    }
}
EntityMap.byName = (name) => (entity) => entity.name === name;
EntityMap.byType = (type) => (entity) => entity.type === type;
EntityMap.sortByIdx = (a, b) => a.idx - b.idx;
__decorate([
    nosync
], EntityMap.prototype, "add", null);
__decorate([
    nosync
], EntityMap.prototype, "remove", null);
__decorate([
    nosync
], EntityMap.prototype, "updateOrder", null);
__decorate([
    nosync
], EntityMap.prototype, "toArray", null);
__decorate([
    nosync
], EntityMap.prototype, "length", null);
export const notifyNewIdx = (entity, idx) => {
    if (entity instanceof Entity) {
        const e = entity;
        logs.verbose("notifyNewIdx", e.type + ":" + e.name, `[${entity.idx} => ${idx}]`);
        e.emit(EntityEvents.idxUpdate, idx);
    }
};
//# sourceMappingURL=entityMap.js.map