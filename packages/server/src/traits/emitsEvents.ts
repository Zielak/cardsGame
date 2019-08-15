import { EventEmitter } from "events"

export function emitsEvents(emitterConstructor: Function) {
  Object.defineProperties(emitterConstructor.prototype, {
    on: {
      get: function() {
        return this.__emitter.on
      }
    },
    once: {
      get: function() {
        return this.__emitter.once
      }
    },
    off: {
      get: function() {
        return this.__emitter.off
      }
    },
    emit: {
      get: function() {
        return this.__emitter.emit
      }
    }
  })
}

export function EmitterConstructor(obj: IEventEmitter) {
  Object.defineProperty(obj, "__emitter", {
    value: new EventEmitter()
  })
}

export interface IEventEmitter {
  on: (event: string | symbol, listener: (...args: any[]) => void) => this
  once: (event: string | symbol, listener: (...args: any[]) => void) => this
  off: (event: string | symbol, listener: (...args: any[]) => void) => this
  emit: (event: string | symbol, ...args: any[]) => boolean
}
