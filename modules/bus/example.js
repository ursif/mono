const createBus = require('./')
const bus = createBus()

// Emit some idea into the ether
//
bus.emit({ type: 'SOME_TYPE', other: 'data' })
    .then(console.log)
    .catch(console.log)

// Get count of currently recorded events
//
bus.count()
    .then(console.log)

// Read past events
// 
bus.scan(/* from: milliseconds , to: milliseconds */ )
    .then(console.log)
    .catch(console.log)

// Delete past events log
//
bus.clear()
    .then(console.log)
    .catch(console.log)

// Listen to messages of this type
// 
bus.listenFor('SOME_TYPE')
    .subscribe(console.log, console.log, console.log)

// Listen to messages of these types
//
bus.listenFor(['SOME_TYPE', 'SOME_OTHER_TYPE'])
    .subscribe(console.log)

// Listen to channels/patterns and filter all messages
// by function
//
bus.listenFor(['SOME_TYPE'], ({ event }) => !event.read)
    .subscribe(console.log)