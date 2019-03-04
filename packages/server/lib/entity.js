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
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var eventemitter3_1 = require("eventemitter3");
var utils_1 = require("@cardsgame/utils");
var entityMap_1 = require("./entityMap");
var state_1 = require("./state");
var transform_1 = require("./transform");
var logs_1 = require("./logs");
var visibilityData_1 = require("./visibilityData");
var decorators_1 = require("./decorators");
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(options) {
        var _this = _super.call(this) || this;
        _this.children = new entityMap_1.EntityMap();
        _this.hijacksInteractionTarget = false;
        _this.isContainer = false;
        // state && id
        _this._state = options.state;
        _this.id = _this._state.rememberEntity(_this);
        _this._visibilityData = new visibilityData_1.VisibilityData();
        _this._visibilityData.add("selected", 
        // it's always player's private bussiness
        /* toEveryone */ function () { return false; }, 
        /* toOwner */ function () { return true; });
        // transform
        _this._localTransform = new transform_1.EntityTransform(options.x, options.y, options.angle);
        _this._localTransform.on("update", function () { return _this.updateTransform(); });
        _this._worldTransform = new transform_1.EntityTransform();
        _this._worldTransform.on("update", function () { return _this.updateTransform(); });
        _this.updateTransform();
        // element data stuff
        _this.type = utils_1.def(options.type, Entity.DEFAULT_TYPE);
        _this.name = utils_1.def(options.name, Entity.DEFAULT_NAME);
        _this.visibleToPublic = true;
        // parent
        if (_this._state.entities) {
            if (!options.parent) {
                // no parent = root as parent
                // this.parent = State.ROOT_ID
                _this._state.entities.addChild(_this);
            }
            else {
                var newParent = typeof options.parent === "number"
                    ? _this._state.getEntity(options.parent)
                    : options.parent;
                newParent.addChild(_this);
            }
        }
        else {
            // It must be the root!
            if (_this.id !== state_1.State.ROOT_ID) {
                // IT ISN'T!!!
                throw new Error("Shouldn't happen. Root doesn't have root's ID?");
            }
            else {
                _this.parent = null;
            }
        }
        _this.setupListeners();
        return _this;
    }
    Entity.prototype.setupListeners = function () {
        var _this = this;
        this.on(utils_1.EntityEvents.childAdded, function (child) {
            _this.onChildAdded(child);
            _this.restyleChildren();
        });
        this.on(utils_1.EntityEvents.childRemoved, function (childID) {
            _this.onChildRemoved(childID);
            _this.restyleChildren();
        });
        // Rare case, when entityMap's self check finds inconsistency.
        this.on(utils_1.EntityEvents.idxUpdate, function (idx) {
            _this.idx = idx;
        });
        this.on(utils_1.EntityEvents.ownerUpdate, function (event) {
            _this.sendAllPrivateAttributes();
        });
        this.on(utils_1.EntityEvents.parentUpdate, function (event) {
            // Need to update even if owner stayed the same.
            // Client will create entirely new container
            if (event.lastParent) {
                event.lastParent.emit(utils_1.StateEvents.privatePropsSyncRequest);
            }
            _this.parentEntity.emit(utils_1.StateEvents.privatePropsSyncRequest);
        });
        this.on(utils_1.EntityEvents.sendPropToEveryone, function (key) {
            _this._sendPrivAttrUpdate(key, true);
        });
        this.on(utils_1.EntityEvents.sendPropToOwner, function (key) {
            _this._sendPrivAttrUpdate(key, false);
        });
        this.on(utils_1.StateEvents.privatePropsSyncRequest, function (client) {
            _this.sendAllPrivateAttributes(client);
            _this.childrenArray.forEach(function (child) {
                child.emit(utils_1.StateEvents.privatePropsSyncRequest, client);
            });
        });
    };
    /**
     * Send out all private attributes, depending on their "privacy state"
     *
     * @param {string} [client] - if defined, will send private stuff only to this client if he owns this element (prevents too much updates)
     */
    Entity.prototype.sendAllPrivateAttributes = function (client) {
        var _this = this;
        // logs.info('sendAllPrivateAttributes', client)
        this._visibilityData.keys.forEach(function (key) {
            if (_this._visibilityData.shouldSendToEveryone(key)) {
                _this._sendPrivAttrUpdate(key, true);
            }
            else if (_this._visibilityData.shouldSendToOwner(key)) {
                if (!client || (_this.owner && _this.owner.clientID === client)) {
                    _this._sendPrivAttrUpdate(key, false);
                }
            }
        });
    };
    Entity.prototype._sendPrivAttrUpdate = function (key, _public) {
        // logs.log('_sendPrivAttrUpdate', _public ? 'public' : 'owner', key)
        var event = {
            path: this.idxPath,
            owner: this.owner && this.owner.clientID,
            public: _public,
            attribute: key,
            value: this[key]
        };
        this._state.emit(utils_1.EntityEvents.privateAttributeChange, event);
    };
    Entity.prototype.addChild = function (child) {
        if (child === this) {
            throw new Error("adding itself as a child makes no sense.");
        }
        if (this.childrenArray.some(function (el) { return el === child; })) {
            logs_1.logs.verbose("Child is already here", child.idxPath);
            return;
        }
        var lastParent = child.parent === state_1.State.ROOT_ID || !child.parent
            ? null
            : child.parentEntity;
        var lastOwner = child.owner;
        if (lastParent) {
            // Remember to remove myself from first parent
            lastParent.removeChild(child.id, true);
        }
        var idx = this.children.add(child);
        child.parent = this.id;
        child.idx = idx;
        var event = {
            entity: child,
            lastParent: lastParent
        };
        // Also emit owner update if that happened
        if (child.owner !== lastOwner &&
            child.owner !== null &&
            lastOwner !== null) {
            logs_1.logs.warn("child.owner", child.owner);
            var event_1 = {
                entity: child,
                previousOwner: lastOwner.clientID,
                currentOwner: child.owner.clientID
            };
            this.emit(utils_1.EntityEvents.ownerUpdate, event_1);
        }
        this.emit(utils_1.EntityEvents.childAdded, child);
        child.emit(utils_1.EntityEvents.parentUpdate, event);
    };
    Entity.prototype.addChildren = function (children) {
        var _this = this;
        children.forEach(function (newChild) {
            _this.addChild(newChild);
        });
    };
    // TODO:
    Entity.prototype.addChildAt = function (newChild, idx) { };
    Entity.prototype.removeChild = function (id, _silent) {
        if (_silent === void 0) { _silent = false; }
        var idx = this.childrenArray.findIndex(function (child) {
            return child.id === id;
        });
        return this.removeChildAt(idx, _silent);
    };
    Entity.prototype.removeChildAt = function (idx, _silent) {
        if (_silent === void 0) { _silent = false; }
        var child = this.children[idx];
        var result = this.children.remove(idx);
        if (!result) {
            return false;
        }
        var lastParent = child.parentEntity;
        child.parent = state_1.State.ROOT_ID;
        // Reset last parent's stylings
        child.resetWorldTransform();
        if (!_silent) {
            var event = {
                entity: child,
                lastParent: lastParent
            };
            child.emit(utils_1.EntityEvents.parentUpdate, event);
        }
        this.emit(utils_1.EntityEvents.childRemoved, child.id);
        return true;
    };
    Entity.prototype.onChildAdded = function (child) { };
    Entity.prototype.onChildRemoved = function (childID) { };
    Entity.prototype.restyleChildren = function () {
        var _this = this;
        this.childrenArray.forEach(function (child, idx, array) {
            var data = _this.restyleChild(child, idx, array);
            if (data.x)
                child._worldTransform.x = data.x;
            if (data.y)
                child._worldTransform.y = data.y;
            if (data.angle)
                child._worldTransform.angle = data.angle;
            child.updateTransform();
        }, this);
    };
    /**
     * Override in each container-like entity
     */
    Entity.prototype.restyleChild = function (child, idx, children) {
        return {
            x: 0,
            y: 0,
            angle: 0
        };
    };
    Entity.prototype.updateTransform = function () {
        var _this = this;
        ;
        ["x", "y", "angle"].map(function (prop) {
            _this[prop] = _this._localTransform[prop] + _this._worldTransform[prop];
        });
    };
    Entity.prototype.resetWorldTransform = function () {
        var _this = this;
        ;
        ["x", "y", "angle"].map(function (prop) {
            _this._worldTransform[prop] = 0;
        });
    };
    Entity.prototype.filterByName = function (name) {
        return this.childrenArray.filter(entityMap_1.EntityMap.byName(name));
    };
    Entity.prototype.findByName = function (name) {
        return this.childrenArray.find(entityMap_1.EntityMap.byName(name));
    };
    Entity.prototype.filterByType = function (type) {
        return this.childrenArray.filter(entityMap_1.EntityMap.byType(type));
    };
    Entity.prototype.findByType = function (type) {
        return this.childrenArray.find(entityMap_1.EntityMap.byType(type));
    };
    Object.defineProperty(Entity.prototype, "top", {
        /**
         * Get the element with highest 'idx' value
         */
        get: function () {
            return this.children[this.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "bottom", {
        /**
         * Get the element with the lowest 'idx' value
         */
        get: function () {
            return this.children[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "length", {
        /**
         * Number of child elements
         */
        get: function () {
            return Object.keys(this.children).length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "interactive", {
        /**
         * Points out if this element can be
         * target of any interaction
         */
        get: function () {
            var parent = this.parentEntity;
            if (parent.hijacksInteractionTarget) {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "childrenArray", {
        /**
         * Gets all children in array form, "sorted" by idx
         */
        get: function () {
            return this.children.toArray();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "parentEntity", {
        /**
         * Gets a reference to this entity's parent.
         * There must be any parent, so any null will fallback to state's `entities`
         */
        get: function () {
            var parent = this._state.getEntity(this.parent);
            return parent || this._state.entities;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "owner", {
        /**
         * Get the real owner of this container, by traversing `this.parent` chain.
         *
         * @returns `Player` or `null` if this container doesn't belong to anyone
         */
        get: function () {
            if (this.parent === state_1.State.ROOT_ID || this.parent === null) {
                return null;
            }
            if (this.parentEntity.type === "player") {
                return this.parentEntity;
            }
            return this.parentEntity.owner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Entity.prototype, "idxPath", {
        get: function () {
            var path = [this.idx];
            var getNext = function (entity) {
                var parentsIdx = entity.parentEntity.idx;
                if (entity.parentEntity instanceof Entity &&
                    typeof parentsIdx === "number") {
                    path.unshift(parentsIdx);
                    getNext(entity.parentEntity);
                }
            };
            getNext(this);
            return path;
        },
        enumerable: true,
        configurable: true
    });
    Entity.DEFAULT_NAME = "Unnamed";
    Entity.DEFAULT_TYPE = "Entity";
    __decorate([
        colyseus_1.nosync
    ], Entity.prototype, "_visibilityData", void 0);
    __decorate([
        colyseus_1.nosync
    ], Entity.prototype, "_state", void 0);
    __decorate([
        colyseus_1.nosync
    ], Entity.prototype, "hijacksInteractionTarget", void 0);
    __decorate([
        decorators_1.condvis
    ], Entity.prototype, "selected", void 0);
    __decorate([
        colyseus_1.nosync
    ], Entity.prototype, "_localTransform", void 0);
    __decorate([
        colyseus_1.nosync
    ], Entity.prototype, "_worldTransform", void 0);
    return Entity;
}(eventemitter3_1.EventEmitter));
exports.Entity = Entity;
// Get rid of EventEmitter stuff from the client
colyseus_1.nosync(Entity.prototype, "_events");
colyseus_1.nosync(Entity.prototype, "_eventsCount");
colyseus_1.nosync(Entity.prototype, "_maxListeners");
colyseus_1.nosync(Entity.prototype, "domain");
//# sourceMappingURL=entity.js.map