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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus = __importStar(require("colyseus"));
var logs_1 = require("./logs");
var commandsManager_1 = require("./commandsManager");
var startGame_1 = require("./commands/startGame");
var state_1 = require("./state");
var utils_1 = require("@cardsgame/utils");
var player_1 = require("./player");
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "CardsGame test";
        return _this;
    }
    Room.prototype.onInit = function (options) {
        logs_1.logs.info("Room:" + this.name, "creating new room");
        this.setState(new state_1.State({
            minClients: options.minClients || 1,
            maxClients: options.maxClients || 4,
            hostID: options.hostID
        }));
        this.commandsManager = new commandsManager_1.CommandsManager();
        this.setupPrivatePropsSync();
        this.onSetupGame(this.state);
    };
    /**
     * Start listening for private prop changes of any existing entity
     */
    Room.prototype.setupPrivatePropsSync = function () {
        var _this = this;
        this.state.on(utils_1.EntityEvents.privateAttributeChange, function (data) {
            // logs.verbose(`privateAttributeChange`, 'public?', data.public)
            if (data.public) {
                _this.broadcast({
                    data: data,
                    event: utils_1.EntityEvents.privateAttributeChange
                });
            }
            else {
                var client = _this.clients.find(function (c) { return c.id === data.owner; });
                if (client) {
                    // logs.log(`privateAttributeChange`, 'sending data to client', client.id, data)
                    _this.send(client, {
                        data: data,
                        event: utils_1.EntityEvents.privateAttributeChange
                    });
                }
                else {
                    // logs.log(`couldn't find the client to sent it to`, data.owner, data)
                }
            }
        });
    };
    Room.prototype.addPlayer = function (clientID) {
        var entity = new player_1.Player({
            state: this.state,
            clientID: clientID,
            parent: this.state.entities.id
        });
        // const idx = this.entities.children.add(newPlayer)
        // newPlayer.idx = idx
        this.state.players.add({ clientID: clientID, entity: entity });
        this.onPlayerAdded(clientID, entity);
        // this.updatePlayers()
        this.state.logTreeState();
    };
    Room.prototype.removePlayer = function (clientID) {
        // TODO: What about all player's cards and stuff?
        // I want those cards back, or be discarded, or put back into deck?
        //  ###==> OR make the game author decide what happens. <==###
        var player = this.state.players
            .toArray()
            .find(function (data) { return data.clientID === clientID; });
        var playerIdx = player.entity.idx;
        if (!player) {
            logs_1.logs.error("removePlayer", "can't find player's data, removed already?", clientID);
        }
        this.state.entities.removeChild(player.entity.id);
        this.state.players.remove(playerIdx);
        // this.updatePlayers()
        this.state.logTreeState();
    };
    Room.prototype.requestJoin = function (options, isRoomNew) {
        // TODO: private rooms?
        // TODO: reject on maxClients reached?
        return true;
    };
    Room.prototype.onJoin = function (client) {
        if (!this.state.isGameStarted) {
            this.addPlayer(client.id);
            this.state.emit(utils_1.StateEvents.privatePropsSyncRequest, client.id);
            logs_1.logs.log("onJoin", "player \"" + client.id + "\" joined");
        }
        else {
            logs_1.logs.info("onJoin", "player joined, but game already started");
        }
    };
    Room.prototype.onLeave = function (client, consented) {
        if (consented) {
            this.removePlayer(client.id);
            logs_1.logs.log("onLeave", "player \"" + client.id + "\" left permamently");
        }
        else {
            logs_1.logs.log("onLeave", "player \"" + client.id + "\" disconnected, might be back");
        }
    };
    Room.prototype.onMessage = function (client, event) {
        if (event.data === "start" && !this.state.isGameStarted) {
            this.onStartGame(this.state);
            new startGame_1.StartGame().execute(this.state);
            return;
        }
        else if (event.data === "start" && this.state.isGameStarted) {
            logs_1.logs.log("onMessage", "Game is already started, ignoring...");
            return;
        }
        // Populate event with server-side known data
        if (event.targetPath) {
            // Make sure
            event.targets = this.state
                .getEntitiesAlongPath(event.targetPath)
                .reverse()
                .filter(function (target) { return target.interactive; });
            event.target = event.targets[0];
        }
        event.player = this.state.players
            .toArray()
            .find(function (playerData) { return playerData.clientID === client.id; }).entity;
        var minifyTarget = function (e) {
            return e.type + ":" + e.name;
        };
        var minifyPlayer = function (p) {
            return p.type + ":" + p.name + "[" + p.clientID + "]";
        };
        logs_1.logs.info("onMessage", JSON.stringify(Object.assign(__assign({}, event), event.target ? { target: minifyTarget(event.target) } : {}, { targets: event.targets.map(minifyTarget) }, event.player ? { player: minifyPlayer(event.player) } : {})));
        this.performAction(client, event);
    };
    /**
     * Check conditions and perform given action
     */
    Room.prototype.performAction = function (client, event) {
        var _this = this;
        var actions = this.getActionsByInteraction(event).filter(function (action) {
            return _this.isLegal(action.conditions, event);
        });
        var logActions = actions.map(function (el) { return el.name; });
        logs_1.logs.info("performAction", "only " + actions.length + " filtered by conditions:", logActions);
        if (actions.length > 1) {
            logs_1.logs.warn("performAction", "Whoops, even after filtering actions by conditions, I still have " + actions.length + " actions!");
            // log(actions)
        }
        if (actions.length === 0) {
            logs_1.logs.info("performAction", "no actions, ignoring.");
            this.broadcast({
                event: "game.info",
                data: "Client " + client.id + ": No actions found for that " + event.type + ", ignoring..."
            });
            return;
        }
        var result = this.commandsManager.orderExecution(actions[0].commandFactory, this.state, event);
        if (result) {
            console.info("Action completed.");
        }
        else {
            this.broadcast({
                event: "game.error",
                data: "Client \"" + client.id + "\" failed to perform action."
            });
        }
    };
    /**
     * Gets you a list of all possible game actions
     * that match with player's interaction
     */
    Room.prototype.getActionsByInteraction = function (event) {
        var possibleEntityProps = ["name", "type", "value", "rank", "suit"];
        var actions = Array.from(this.possibleActions.values()).filter(function (template) {
            // All interactions defined in the template by game author
            var interactions = Array.isArray(template.interaction)
                ? template.interaction
                : [template.interaction];
            // TODO: REFACTOR
            // You just introduced event.targets, is an array of all child-parent
            // from the top-most entity down to the thing that was actually clicked.
            /**
             * * there can be many sets of interactions
             * * an interaction signature may point to elements by set of properties
             * 		['name', 'rank', 'type'...]
             * * FIXME: client may click on nth card in pile, but is required to interact with TOP card only.
             *   - this doesn't work
             *
             * get reversed targets array (from target to its parents)
             * for each interaction (or one)
             * 	for each reversedTargets ->
             * 		chek all its props
             */
            /**
             * For every possible prop, check if its defined in this action.
             * If so, push it to checkProp()
             */
            var entityMatchesInteraction = function (target, interaction) {
                return possibleEntityProps.every(function (prop) {
                    if (interaction[prop]) {
                        if (Array.isArray(interaction[prop])) {
                            return interaction[prop].some(function (value) { return value === target[prop]; });
                        }
                        else if (target[prop] !== interaction[prop]) {
                            return false;
                        }
                    }
                    // Prop either matches or was not defined in interaction/desired
                    return true;
                });
            };
            return event.targets
                .filter(function (target) { return target.interactive; })
                .some(function (target) {
                return interactions.some(function (int) { return entityMatchesInteraction(target, int); });
            });
        });
        var logActions = actions.map(function (el) { return el.name; });
        logs_1.logs.info("performAction", actions.length + " actions by this interaction:", logActions);
        return actions;
    };
    /**
     * Checks all attatched conditions (if any) to see if this action is legal
     */
    Room.prototype.isLegal = function (conditions, event) {
        var _this = this;
        if (conditions === undefined || conditions.length === 0) {
            return true;
        }
        return conditions.every(function (condition) { return condition(_this.state, event); });
    };
    /**
     * Will be called right after the game room is created.
     * Prepare your play area now.
     * @param state
     */
    Room.prototype.onSetupGame = function (state) {
        logs_1.logs.error("Room", "onSetupGame is not implemented!");
    };
    /**
     * Will be called when players agree to start the game.
     * Now is the time to for example deal cards to all players.
     * @param state
     */
    Room.prototype.onStartGame = function (state) {
        logs_1.logs.error("Room", "onStartGame is not implemented!");
    };
    Room.prototype.onPlayerAdded = function (clientID, entity) {
        logs_1.logs.info("Room", "onPlayerAdded is not implemented.");
    };
    Room.prototype.onPlayerRemoved = function (clientID) {
        logs_1.logs.info("Room", "onPlayerRemoved is not implemented.");
    };
    return Room;
}(colyseus.Room));
exports.Room = Room;
//# sourceMappingURL=room.js.map