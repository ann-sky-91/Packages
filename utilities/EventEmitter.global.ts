import globalify from 'utilities/globalify'

import * as module from './EventEmitter'

globalify({ EventEmitter: module.default })

declare global {
    class EventEmitter extends module.default {}
}
