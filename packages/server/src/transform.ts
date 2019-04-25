import { EventEmitter } from "eventemitter3"

export type EntityTransformData = {
  x: number
  y: number
  angle: number
}

export class EntityTransform extends EventEmitter {
  private _x: number
  private _y: number
  private _angle: number

  constructor(x: number = 0, y: number = 0, angle: number = 0) {
    super()
    this._x = x
    this._y = y
    this._angle = angle
  }

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }
  get angle() {
    return this._angle
  }

  set x(value: number) {
    this._x = value
    this.emit("update")
  }
  set y(value: number) {
    this._y = value
    this.emit("update")
  }
  set angle(value: number) {
    this._angle = value
    this.emit("update")
  }
}
