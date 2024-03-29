import globalify from 'utilities/globalify'
import * as module from './PromisesPool'

globalify({ PromisesPool: module.default })

declare global {
    interface PromisesPool extends module.default {}
    const PromisesPool: typeof module.default
}
