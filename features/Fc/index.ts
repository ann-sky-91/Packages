import 'imports'
import globalify from 'utilities/globalify'

import { getFunctionContext, FunctionContext } from '../function-contexts'

declare global {
    type Fc = typeof module.Fc
    const Fc: typeof module.Fc
}

const OriginalObject = Object
namespace module {
    Fc.createContext = function <T>(): FunctionContext<T> {
        return createFunctionContext()
    }

    Fc.context = function <T>(context: FunctionContext<T>): T {
        return getFunctionContext(context)
    }

    Fc.pure = function Fc<T, R extends unknown[] = []>(
        Fc: (this: undefined, ...args: R) => void
    ): {
        new (...args: R): T
        prototype: T
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc as never, arguments[1], true) as never
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }

    Fc.destroy = function (destroy: () => void): void {
        this['___destroy'] = destroy
    }

    Fc.dispose = function (dispose: () => void): void {
        this['___dispose'] = dispose
    }

    Fc.get = function (get: (key: string | symbol) => unknown): void {
        this['___get'] = get
    }

    Fc.set = function (set: (key: string | symbol) => unknown): void {
        this['___set'] = set
    }

    export function Fc<T, R extends unknown[] = []>(
        Fc: (this: Effect, ...args: R) => void
    ): {
        new (link: Effect, ...args: R): T & Effect
        prototype: T
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc, arguments[1], false)
    }

    const create = <T, R extends unknown[]>(
        Fc: (this: Effect, ...args: R) => void,
        isForwardNew = false,
        isPure = false
    ): {
        new (link: Effect, ...args: R): T & Effect
        prototype: T & Effect
    } => {
        if (isForwardNew) {
            return Fc as never
        }

        function Object(link: unknown, ...args: unknown[]): void {
            if (!isPure && (link == null || typeof link !== 'object')) {
                throw Error('link missing')
            }

            const meta = OriginalObject.create(module.Fc)
            const [object, prototype] = Fc.call(meta, ...(isPure ? [link, ...args] : args))

            if (!isPure) {
                OriginalObject.setPrototypeOf(prototype, Effect.prototype)
                Effect.call(prototype)

                prototype[meta.destroy ? 'destroy' : 'dispose'] =
                    meta['___destroy'] ?? meta['___dispose']
            }

            return OriginalObject.setPrototypeOf(object, prototype)
        }

        return Object as never
    }
}

globalify(module)