const { promisify } = require('util')
const redis = require('redis')
const withDefaults = require('with-defaults')
const createJob = require('../job')

const queueDefaults = withDefaults({
    queueName: 'ursif_queue',
    requeueName: 'ursif_requeue',
    config: {
        port: 9996,
        host: 'localhost'
    }
})
/**
 * A queue is a list of remaing
 * jobs that a consumer can 
 */
const queue = (opts = {}) => {
    const {
        queueName,
        requeueName,
        config,
    } = queueDefaults(opts)

    const cache = redis.createClient({
        port: config.port,
        host: config.host,
    })

    const push = promisify(cache.rpush).bind(cache)
    const pop = promisify(cache.brpoplpush).bind(cache)
    const remove = promisify(cache.lrem).bind(cache)
    const length = promisify(cache.llen).bind(cache)
    const drop = promisify(cache.del).bind(cache)

    return ({
        // Add a job to the queue
        add: async event => {
            const job = createJob(event)
            const added = await push(queueName, JSON.stringify(job))
            if (added) {
                return job
            }
             
            throw new Error('QUEUE_ADD_ERROR')
        },
        // Get a job from the queue
        next: async () => {
            const unparsedJob = await pop(queueName, requeueName, 1000)
            if (unparsedJob) {
                return JSON.parse(unparsedJob)
            }

            return unparsedJob
        },
        // Finish a job taken from the queue
        finish: job => remove(requeueName, -1, JSON.stringify(job)),
        // Get count of both queue
        count: () => Promise.all([
            length(queueName),
            length(requeueName)
        ]).then(([qL, rL]) => ({
            queueLength: qL,
            requeueLength: rL
        })),
        // Clear all queue
        drop: () => Promise.all([
            drop(queueName),
            drop(requeueName)
        ]).then(([d, i]) => ({
            queue: d,
            requeue: i
        })),
        // clear one queue defaults to add queue
        clear: (queue = queueName) => drop(queueName) 
    })
}

module.exports = queue