var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { nosync } from "colyseus";
import { EventEmitter } from "eventemitter3";
import { def, EntityEvents, StateEvents } from "@cardsgame/utils";
import { EntityMap } from "./entityMap";
import { State } from "./state";
import { EntityTransform } from "./transform";
import { logs } from "./logs";
import { VisibilityData } from "./visibilityData";
import { condvis } from "./decorators";
export class Entity extends EventEmitter {
    constructor(options) {
        super();
        this.children = new EntityMap();
        this.hijacksInteractionTarget = false;
        this.isContainer = false;
        // state && id
        this._state = options.state;
        this.id = this._state.rememberEntity(this);
        this._visibilityData = new VisibilityData();
        this._visibilityData.add("selected", 
        // it's always player's private bussiness
        /* toEveryone */ () => false, 
        /* toOwner */ () => true);
        // transform
        this._localTransform = new EntityTransform(options.x, options.y, options.angle);
        this._localTransform.on("update", () => this.updateTransform());
        this._worldTransform = new EntityTransform();
        this._worldTransform.on("update", () => this.updateTransform());
        this.updateTransform();
        // element data stuff
        this.type = def(options.type, Entity.DEFAULT_TYPE);
        this.name = def(options.name, Entity.DEFAULT_NAME);
        this.visibleToPublic = true;
        // parent
        if (this._state.entities) {
            if (!options.parent) {
                // no parent = root as parent
                // this.parent = State.ROOT_ID
                this._state.entities.addChild(this);
            }
            else {
                const newParent = typeof options.parent === "number"
                    ? this._state.getEntity(options.parent)
                    : options.parent;
                newParent.addChild(this);
            }
        }
        else {
            // It must be the root!
            if (this.id !== State.ROOT_ID) {
                // IT ISN'T!!!
                throw new Error(`Shouldn't happen. Root doesn't have root's ID?`);
            }
            else {
                this.parent = null;
            }
        }
        this.setupListeners();
    }
    setupListeners() {
        this.on(EntityEvents.childAdded, (child) => {
            this.onChildAdded(child);
            this.restyleChildren();
        });
        this.on(EntityEvents.childRemoved, (childID) => {
            this.onChildRemoved(childID);
            this.restyleChildren();
        });
        // Rare case, when entityMap's self check finds inconsistency.
        this.on(EntityEvents.idxUpdate, (idx) => {
            this.idx = idx;
        });
        this.on(EntityEvents.ownerUpdate, (event) => {
            this.sendAllPrivateAttributes();
        });
        this.on(EntityEvents.parentUpdate, (event) => {
            // Need to update even if owner stayed the same.
            // Client will create entirely new container
            if (event.lastParent) {
                event.lastParent.emit(StateEvents.privatePropsSyncRequest);
            }
            this.parentEntity.emit(StateEvents.privatePropsSyncRequest);
        });
        this.on(EntityEvents.sendPropToEveryone, (key) => {
            this._sendPrivAttrUpdate(key, true);
        });
        this.on(EntityEvents.sendPropToOwner, (key) => {
            this._sendPrivAttrUpdate(key, false);
        });
        this.on(StateEvents.privatePropsSyncRequest, (client) => {
            this.sendAllPrivateAttributes(client);
            this.childrenArray.forEach(child => {
                child.emit(StateEvents.privatePropsSyncRequest, client);
            });
        });
    }
    /**
     * Send out all private attributes, depending on their "privacy state"
     *
     * @param {string} [client] - if defined, will send private stuff only to this client if he owns this element (prevents too much updates)
     */
    sendAllPrivateAttributes(client) {
        // logs.info('sendAllPrivateAttributes', client)
        this._visibilityData.keys.forEach(key => {
            if (this._visibilityData.shouldSendToEveryone(key)) {
                this._sendPrivAttrUpdate(key, true);
            }
            else if (this._visibilityData.shouldSendToOwner(key)) {
                if (!client || (this.owner && this.owner.clientID === client)) {
                    this._sendPrivAttrUpdate(key, false);
                }
            }
        });
    }
    _sendPrivAttrUpdate(key, _public) {
        // logs.log('_sendPrivAttrUpdate', _public ? 'public' : 'owner', key)
        const event = {
            path: this.idxPath,
            owner: this.owner && this.owner.clientID,
            public: _public,
            attribute: key,
            value: this[key]
        };
        this._state.emit(EntityEvents.privateAttributeChange, event);
    }
    addChild(child) {
        if (child === this) {
            throw new Error(`adding itself as a child makes no sense.`);
        }
        if (this.childrenArray.some(el => el === child)) {
            logs.verbose(`Child is already here`, child.idxPath);
            return;
        }
        const lastParent = child.parent === State.ROOT_ID || !child.parent
            ? null
            : child.parentEntity;
        const lastOwner = child.owner;
        if (lastParent) {
            // Remember to remove myself from first parent
            lastParent.removeChild(child.id, true);
        }
        const idx = this.children.add(child);
        child.parent = this.id;
        child.idx = idx;
        const event = {
            entity: child,
            lastParent
        };
        // Also emit owner update if that happened
        if (child.owner !== lastOwner &&
            child.owner !== null &&
            lastOwner !== null) {
            logs.warn("child.owner", child.owner);
            const event = {
                entity: child,
                previousOwner: lastOwner.clientID,
                currentOwner: child.owner.clientID
            };
            this.emit(EntityEvents.ownerUpdate, event);
        }
        this.emit(EntityEvents.childAdded, child);
        child.emit(EntityEvents.parentUpdate, event);
    }
    addChildren(children) {
        children.forEach(newChild => {
            this.addChild(newChild);
        });
    }
    // TODO:
    addChildAt(newChild, idx) { }
    removeChild(id, _silent = false) {
        const idx = this.childrenArray.findIndex(child => {
            return child.id === id;
        });
        return this.removeChildAt(idx, _silent);
    }
    removeChildAt(idx, _silent = false) {
        const child = this.children[idx];
        const result = this.children.remove(idx);
        if (!result) {
            return false;
        }
        const lastParent = child.parentEntity;
        child.parent = State.ROOT_ID;
        // Reset last parent's stylings
        child.resetWorldTransform();
        if (!_silent) {
            const event = {
                entity: child,
                lastParent
            };
            child.emit(EntityEvents.parentUpdate, event);
        }
        this.emit(EntityEvents.childRemoved, child.id);
        return true;
    }
    onChildAdded(child) { }
    onChildRemoved(childID) { }
    restyleChildren() {
        this.childrenArray.forEach((child, idx, array) => {
            const data = this.restyleChild(child, idx, array);
            if (data.x)
                child._worldTransform.x = data.x;
            if (data.y)
                child._worldTransform.y = data.y;
            if (data.angle)
                child._worldTransform.angle = data.angle;
            child.updateTransform();
        }, this);
    }
    /**
     * Override in each container-like entity
     */
    restyleChild(child, idx, children) {
        return {
            x: 0,
            y: 0,
            angle: 0
        };
    }
    updateTransform() {
        ;
        ["x", "y", "angle"].map(prop => {
            this[prop] = this._localTransform[prop] + this._worldTransform[prop];
        });
    }
    resetWorldTransform() {
        ;
        ["x", "y", "angle"].map(prop => {
            this._worldTransform[prop] = 0;
        });
    }
    filterByName(name) {
        return this.childrenArray.filter(EntityMap.byName(name));
    }
    findByName(name) {
        return this.childrenArray.find(EntityMap.byName(name));
    }
    filterByType(type) {
        return this.childrenArray.filter(EntityMap.byType(type));
    }
    findByType(type) {
        return this.childrenArray.find(EntityMap.byType(type));
    }
    /**
     * Get the element with highest 'idx' value
     */
    get top() {
        return this.children[this.length - 1];
    }
    /**
     * Get the element with the lowest 'idx' value
     */
    get bottom() {
        return this.children[0];
    }
    /**
     * Number of child elements
     */
    get length() {
        return Object.keys(this.children).length;
    }
    /**
     * Points out if this element can be
     * target of any interaction
     */
    get interactive() {
        const parent = this.parentEntity;
        if (parent.hijacksInteractionTarget) {
            return false;
        }
        return true;
    }
    /**
     * Gets all children in array form, "sorted" by idx
     */
    get childrenArray() {
        return this.children.toArray();
    }
    /**
     * Gets a reference to this entity's parent.
     * There must be any parent, so any null will fallback to state's `entities`
     */
    get parentEntity() {
        const parent = this._state.getEntity(this.parent);
        return parent || this._state.entities;
    }
    /**
     * Get the real owner of this container, by traversing `this.parent` chain.
     *
     * @returns `Player` or `null` if this container doesn't belong to anyone
     */
    get owner() {
        if (this.parent === State.ROOT_ID || this.parent === null) {
            return null;
        }
        if (this.parentEntity.type === "player") {
            return this.parentEntity;
        }
        return this.parentEntity.owner;
    }
    get idxPath() {
        const path = [this.idx];
        const getNext = (entity) => {
            const parentsIdx = entity.parentEntity.idx;
            if (entity.parentEntity instanceof Entity &&
                typeof parentsIdx === "number") {
                path.unshift(parentsIdx);
                getNext(entity.parentEntity);
            }
        };
        getNext(this);
        return path;
    }
}
Entity.DEFAULT_NAME = "Unnamed";
Entity.DEFAULT_TYPE = "Entity";
__decorate([
    nosync
], Entity.prototype, "_visibilityData", void 0);
__decorate([
    nosync
], Entity.prototype, "_state", void 0);
__decorate([
    nosync
], Entity.prototype, "hijacksInteractionTarget", void 0);
__decorate([
    condvis
], Entity.prototype, "selected", void 0);
__decorate([
    nosync
], Entity.prototype, "_localTransform", void 0);
__decorate([
    nosync
], Entity.prototype, "_worldTransform", void 0);
// Get rid of EventEmitter stuff from the client
nosync(Entity.prototype, "_events");
nosync(Entity.prototype, "_eventsCount");
nosync(Entity.prototype, "_maxListeners");
nosync(Entity.prototype, "domain");
//# sourceMappingURL=entity.js.map