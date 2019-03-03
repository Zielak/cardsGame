var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nosync } from "colyseus";
import { Entity } from "./entity";
import { EntityEvents } from "@cardsgame/utils";
export class Player extends Entity {
    constructor(options) {
        super(options);
        this.type = "player";
        this.score = 0;
        this.timeLeft = Infinity;
        this.clientID = options.clientID;
        this._selectedEntities = new Set();
    }
    /**
     * Will make this element selected in
     * the eyes of this player. This knowledge
     * is not shared with others by default.
     * @param entity
     */
    selectEntity(entity) {
        this._selectedEntities.add(entity);
        const event = {
            path: entity.idxPath,
            owner: this.clientID,
            public: false,
            attribute: "selected",
            value: true
        };
        this._state.emit(EntityEvents.privateAttributeChange, event);
        this.selectedEntitiesCount = this._selectedEntities.size;
    }
    deselectEntity(entity) {
        this._selectedEntities.delete(entity);
        const event = {
            path: entity.idxPath,
            owner: this.clientID,
            public: false,
            attribute: "selected",
            value: false
        };
        this._state.emit(EntityEvents.privateAttributeChange, event);
        this.selectedEntitiesCount = this._selectedEntities.size;
    }
    clearSelection() {
        const deselected = [];
        for (let entity of this._selectedEntities.values()) {
            deselected.push(entity);
            this.deselectEntity(entity);
        }
        return deselected;
    }
    isEntitySelected(entity) {
        return this._selectedEntities.has(entity);
    }
    get selectedEntities() {
        return Array.from(this._selectedEntities.values());
    }
}
__decorate([
    nosync
], Player.prototype, "_selectedEntities", void 0);
//# sourceMappingURL=player.js.map