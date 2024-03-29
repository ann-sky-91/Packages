import { _ON_END, _SYSTEMS } from './--'
import _Effects from './--Effects'
import _signalEnd from './--signalEnd'

export {}

declare global {
    class Entities<R = void, A extends unknown[] = []> extends _Effects<R, A> {
        constructor(systems?: {}[])

        get destroy(): (...args: A) => Promise<Awaited<R>>

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        )

        run()
    }
}

async function destroy<R, A extends unknown[]>(
    this: Entity<R, A>,
    ...args: A
): Promise<Awaited<R>> {
    _signalEnd.call(this)
    return this['resolve'](await this[_ON_END](...args))
}

namespace module {
    export class Entities<R = void, A extends unknown[] = []> extends _Effects<R, A> {
        constructor(systems?: { run: (dt: number) => void }[]) {
            super()

            if (systems) {
                this[_SYSTEMS] = {}
                this['___systems'] = systems
            }

            systems &&
                systems.forEach(system => {
                    const { Components } = system.constructor as never as { Components }
                    Components &&
                        Object.keys(Components).forEach(k => {
                            Components[k].forEach(Component => {
                                this[_SYSTEMS][Component.name] ??= []
                                if (!this[_SYSTEMS][Component.name].includes(system)) {
                                    this[_SYSTEMS][Component.name].push(system)
                                }
                            })
                        })
                })
        }

        run(): void {
            this['___timer'] ??= new Timer('(Entities).run')
            this['___systems'].forEach(system => system.run(this['___timer'].time().valueOf()))
        }

        get destroy(): (...args: A) => Promise<Awaited<R>> {
            return destroy
        }

        set destroy(
            destroy: (
                nextDestroy: (...args: A) => Promise<Awaited<R>>,
                ...args: A
            ) => Promise<Awaited<R>>
        ) {
            const originalDestroy = this[_ON_END]
            this[_ON_END] = (...args: A): Promise<Awaited<R>> => {
                return destroy(originalDestroy, ...args)
            }
        }

        private [_SYSTEMS]: Record<string, {}[]>
        private ['___systems']: { run(dt: number) }[]

        private ['___timer']: Timer
    }
}

Object.assign(global, module)
