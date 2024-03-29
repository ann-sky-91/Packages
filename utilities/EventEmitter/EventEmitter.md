# EventEmitter
## Depends
standard \
\- Array.prototype.remove

## Examples
```typescript
import 'utilities/EventEmitter.global'

const eventEmitter = new EventEmitter()
const dispose = eventEmitter.on('test', () => console.log('test'))
eventEmitter.emit('test') // fire event
dispose()
```
Inheritance
```typescript
import 'utilities/EventEmitter.global'

class Test extends EventEmitter {}
const test = new Test()
const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()
```
Function
```typescript
import 'utilities/EventEmitter.global'

const test = EventEmitter.extend(() => {
    console.log('I am a function!')
})

const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()

test()
```