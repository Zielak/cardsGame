var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nosync } from "colyseus";
import { EventEmitter } from "eventemitter3";
import { logs } from "./logs";
import { rad2deg, StateEvents } from "@cardsgame/utils";
import { Entity } from "./entity";
import { EntityMap } from "./entityMap";
export class State extends EventEmitter {
    constructor(options) {
        super();
        // 60 cm
        this.tableWidth = 600;
        // 60 cm
        this.tableHeight = 600;
        this.players = new EntityMap();
        this.isGameStarted = false;
        this._lastID = -1;
        this._allEntities = new Map();
        // TODO: do something with these options.
        this.entities = new Entity({
            state: this,
            type: "root",
            name: "root"
        });
        this.setupListeners();
    }
    get currentPlayer() {
        return this.players[this.currentPlayerIdx];
    }
    get playersCount() {
        return this.players.length;
    }
    setupListeners() {
        this.on(StateEvents.privatePropsSyncRequest, (client) => {
            // Bubble it down to every entity
            logs.info("State.privatePropsSyncRequest");
            this.entities.emit(StateEvents.privatePropsSyncRequest, client);
        });
    }
    /**
     * FIXME: that should be client-side code...
     * Player playing the game needs to have his cards visible
     * at HIS pottom of the screen...
     */
    updatePlayers() {
        this.entities.childrenArray
            .filter((entity) => entity.type === "player")
            .forEach((player, idx, players) => {
            const angle = ((Math.PI * 2) / players.length) * idx;
            const point = {
                x: Math.sin(angle) * (this.tableWidth * 0.4),
                y: Math.cos(angle) * (this.tableHeight * 0.4)
            };
            player.angle = -rad2deg(angle);
            player.x = point.x;
            player.y = point.y;
            logs.log("updatePlayers", `player[${idx}] angle: ${angle}, point: (${point.x}, ${point.y})`);
        });
    }
    /**
     * Registers new entity to the gamestate
     * @param entity
     * @returns new ID to be assigned to that entity
     */
    rememberEntity(entity) {
        const newID = ++this._lastID;
        this._allEntities.set(newID, entity);
        return newID;
    }
    getEntity(idOrPath) {
        if (Array.isArray(idOrPath)) {
            const travel = (entity, path) => {
                const idx = path.shift();
                const newChild = entity.children[idx];
                if (!newChild) {
                    logs.error("getEntity/path", `This entity doesn't have such child`);
                }
                if (path.length > 0) {
                    return travel(newChild, path);
                }
                else {
                    return newChild;
                }
            };
            return travel(this.entities, [...idOrPath]);
        }
        return this._allEntities.get(idOrPath);
    }
    /**
     * Gets an array of all entities from the top-most parent
     * to the lowest of the child.
     */
    getEntitiesAlongPath(path) {
        const travel = (entity, path, result = []) => {
            const idx = path.shift();
            const newChild = entity.children[idx];
            if (!newChild) {
                logs.error("getEntity/path", `This entity doesn't have such child`);
            }
            result.push(newChild);
            if (path.length > 0) {
                return travel(newChild, path, result);
            }
            else {
                return result;
            }
        };
        return travel(this.entities, [...path]);
    }
    logTreeState() {
        logs.log("");
        const indent = (level) => {
            return "│ ".repeat(level);
        };
        const travel = (entity, level = 0) => {
            entity.childrenArray.map((child, idx, entities) => {
                if (child.parentEntity.isContainer &&
                    entities.length > 5 &&
                    idx < entities.length - 5) {
                    // That's too much, man!
                    if (idx === 0) {
                        logs.log(`${indent(level)}`, "...");
                    }
                    return;
                }
                const owner = child.owner;
                const lastChild = entities.length - 1 === idx;
                const sIdx = idx === child.idx ? `${idx}` : `e${child.idx}:s${idx}`;
                const sVisibility = child.visibleToPublic ? "Pub" : "";
                const sChildren = child.length > 0 ? child.length + " children" : "";
                const sOwner = owner ? `(${owner.type} ${owner.clientID})` : "";
                const branchSymbol = lastChild ? "┕━" : "┝━";
                logs.log(`${indent(level)}${branchSymbol}[${sIdx}]${sVisibility}`, `${child.type}:${child.name}-[${child.idx}]`, sChildren, sOwner);
                if (child.length > 0) {
                    travel(child, level + 1);
                }
            });
        };
        const root = this.entities;
        logs.log(`┍━[${root.idx}]`, `${root.type}:${root.name}`, root.length + "children");
        travel(root, 1);
    }
}
State.ROOT_ID = 0;
__decorate([
    nosync
], State.prototype, "_lastID", void 0);
__decorate([
    nosync
], State.prototype, "_allEntities", void 0);
// Get rid of EventEmitter stuff from the client
nosync(State.prototype, "_events");
nosync(State.prototype, "_eventsCount");
nosync(State.prototype, "_maxListeners");
nosync(State.prototype, "domain");
//# sourceMappingURL=state.js.map