const createQueue = require('./modules/queue')

const queue = createQueue()

// queue.next()
//     .then(console.log)
//     .catch(console.log)

// queue.finish({ cmd: 'HOMEWORK',
// _id: 'ea82a112-c368-4187-96ba-608ec9b19f77',
// created_at: 1527449378255 })
// .then(console.log)
// .catch(console.log)

queue.count()
    .then(console.log)
    .catch(console.log)