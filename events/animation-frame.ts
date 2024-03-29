export {}

declare global {
    interface Effects {
        emit(event: 'Frame', dt: time): void
    }

    var Frame: (entity: Entity | Effect, callback: (dt: time) => void) => void
    var emittingFrame: (link: Effects, options?: { log?: boolean; auto?: boolean }) => () => void
}

namespace module {
    export function emittingFrame(
        link: Effects,
        options: { auto?: boolean; log?: boolean } = {}
    ): () => void {
        const auto = options.auto ?? true
        const log = options.log ?? false

        const timer = new Timer('Frame')
        auto &&
            AnimationFrames(link, () => {
                log && timer.log()
                link.emit('Frame', timer.time())
            })

        if (!auto) {
            return (): void => {
                log && timer.log()
                link.emit('Frame', timer.time())
            }
        }
    }
}

Object.assign(global, module, {
    Frame: (entity: Entity | Effect, callback: (dt: time) => void): void =>
        on(entity, 'Frame', callback),
})
