import { EventEmitter } from "eventemitter3";
export class EntityTransform extends EventEmitter {
    constructor(x = 0, y = 0, angle = 0) {
        super();
        this._x = x;
        this._y = y;
        this._angle = angle;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get angle() {
        return this._angle;
    }
    set x(value) {
        this._x = value;
        this.emit("update");
    }
    set y(value) {
        this._y = value;
        this.emit("update");
    }
    set angle(value) {
        this._angle = value;
        this.emit("update");
    }
}
//# sourceMappingURL=transform.js.map