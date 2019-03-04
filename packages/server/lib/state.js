"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var eventemitter3_1 = require("eventemitter3");
var logs_1 = require("./logs");
var utils_1 = require("@cardsgame/utils");
var entity_1 = require("./entity");
var entityMap_1 = require("./entityMap");
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State(options) {
        var _this = _super.call(this) || this;
        // 60 cm
        _this.tableWidth = 600;
        // 60 cm
        _this.tableHeight = 600;
        _this.players = new entityMap_1.EntityMap();
        _this.isGameStarted = false;
        _this._lastID = -1;
        _this._allEntities = new Map();
        // TODO: do something with these options.
        _this.entities = new entity_1.Entity({
            state: _this,
            type: "root",
            name: "root"
        });
        _this.setupListeners();
        return _this;
    }
    Object.defineProperty(State.prototype, "currentPlayer", {
        get: function () {
            return this.players[this.currentPlayerIdx];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "playersCount", {
        get: function () {
            return this.players.length;
        },
        enumerable: true,
        configurable: true
    });
    State.prototype.setupListeners = function () {
        var _this = this;
        this.on(utils_1.StateEvents.privatePropsSyncRequest, function (client) {
            // Bubble it down to every entity
            logs_1.logs.info("State.privatePropsSyncRequest");
            _this.entities.emit(utils_1.StateEvents.privatePropsSyncRequest, client);
        });
    };
    /**
     * FIXME: that should be client-side code...
     * Player playing the game needs to have his cards visible
     * at HIS pottom of the screen...
     */
    State.prototype.updatePlayers = function () {
        var _this = this;
        this.entities.childrenArray
            .filter(function (entity) { return entity.type === "player"; })
            .forEach(function (player, idx, players) {
            var angle = ((Math.PI * 2) / players.length) * idx;
            var point = {
                x: Math.sin(angle) * (_this.tableWidth * 0.4),
                y: Math.cos(angle) * (_this.tableHeight * 0.4)
            };
            player.angle = -utils_1.rad2deg(angle);
            player.x = point.x;
            player.y = point.y;
            logs_1.logs.log("updatePlayers", "player[" + idx + "] angle: " + angle + ", point: (" + point.x + ", " + point.y + ")");
        });
    };
    /**
     * Registers new entity to the gamestate
     * @param entity
     * @returns new ID to be assigned to that entity
     */
    State.prototype.rememberEntity = function (entity) {
        var newID = ++this._lastID;
        this._allEntities.set(newID, entity);
        return newID;
    };
    State.prototype.getEntity = function (idOrPath) {
        if (Array.isArray(idOrPath)) {
            var travel_1 = function (entity, path) {
                var idx = path.shift();
                var newChild = entity.children[idx];
                if (!newChild) {
                    logs_1.logs.error("getEntity/path", "This entity doesn't have such child");
                }
                if (path.length > 0) {
                    return travel_1(newChild, path);
                }
                else {
                    return newChild;
                }
            };
            return travel_1(this.entities, __spread(idOrPath));
        }
        return this._allEntities.get(idOrPath);
    };
    /**
     * Gets an array of all entities from the top-most parent
     * to the lowest of the child.
     */
    State.prototype.getEntitiesAlongPath = function (path) {
        var travel = function (entity, path, result) {
            if (result === void 0) { result = []; }
            var idx = path.shift();
            var newChild = entity.children[idx];
            if (!newChild) {
                logs_1.logs.error("getEntity/path", "This entity doesn't have such child");
            }
            result.push(newChild);
            if (path.length > 0) {
                return travel(newChild, path, result);
            }
            else {
                return result;
            }
        };
        return travel(this.entities, __spread(path));
    };
    State.prototype.logTreeState = function () {
        logs_1.logs.log("");
        var indent = function (level) {
            return "│ ".repeat(level);
        };
        var travel = function (entity, level) {
            if (level === void 0) { level = 0; }
            entity.childrenArray.map(function (child, idx, entities) {
                if (child.parentEntity.isContainer &&
                    entities.length > 5 &&
                    idx < entities.length - 5) {
                    // That's too much, man!
                    if (idx === 0) {
                        logs_1.logs.log("" + indent(level), "...");
                    }
                    return;
                }
                var owner = child.owner;
                var lastChild = entities.length - 1 === idx;
                var sIdx = idx === child.idx ? "" + idx : "e" + child.idx + ":s" + idx;
                var sVisibility = child.visibleToPublic ? "Pub" : "";
                var sChildren = child.length > 0 ? child.length + " children" : "";
                var sOwner = owner ? "(" + owner.type + " " + owner.clientID + ")" : "";
                var branchSymbol = lastChild ? "┕━" : "┝━";
                logs_1.logs.log("" + indent(level) + branchSymbol + "[" + sIdx + "]" + sVisibility, child.type + ":" + child.name + "-[" + child.idx + "]", sChildren, sOwner);
                if (child.length > 0) {
                    travel(child, level + 1);
                }
            });
        };
        var root = this.entities;
        logs_1.logs.log("\u250D\u2501[" + root.idx + "]", root.type + ":" + root.name, root.length + "children");
        travel(root, 1);
    };
    State.ROOT_ID = 0;
    __decorate([
        colyseus_1.nosync
    ], State.prototype, "_lastID", void 0);
    __decorate([
        colyseus_1.nosync
    ], State.prototype, "_allEntities", void 0);
    return State;
}(eventemitter3_1.EventEmitter));
exports.State = State;
// Get rid of EventEmitter stuff from the client
colyseus_1.nosync(State.prototype, "_events");
colyseus_1.nosync(State.prototype, "_eventsCount");
colyseus_1.nosync(State.prototype, "_maxListeners");
colyseus_1.nosync(State.prototype, "domain");
//# sourceMappingURL=state.js.map