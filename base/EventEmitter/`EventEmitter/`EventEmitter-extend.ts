import EventEmitter from '../`EventEmitter'

EventEmitter.extend = function extend<T extends unknown[], TT, R>(
    fn: (this: TT, ...args: T) => R
): ((this: TT, ...args: T) => R) & EventEmitter {
    Object.setPrototypeOf(fn, EventEmitter.prototype)

    return fn as ((this: TT, ...args: T) => R) & EventEmitter
}
