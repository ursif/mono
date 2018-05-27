const withDefaults = require('with-defaults')
const getCacheFunctions = require('./modules/cacheFunctions')
const createCache = require('./modules/createCache')
const defaultRetryStrategy = require('./modules/retryJobs')
const createJob = require('../job')

/**
 * @typedef {Object} QueueDefaults
 * 
 * @prop {string} queueName - Name of queue
 * @prop {string} requeueName - Name of requeue
 * @prop {Object} config - Config to pass to redis
 * @prop {function(cache, config) => cache} retyStrategy - Strategy for retrying 
 */

const queueDefaults = withDefaults({
    queueName: 'ursif_queue',
    requeueName: 'ursif_requeue',
    config: {
        port: 9996,
        host: 'localhost'
    },
    retryStrategy: defaultRetryStrategy
})
/**
 * @typedef {Object} Queue
 * 
 * @prop {function(event) => Promise<Job>} add - Add a job to the queue
 * @prop {function() => Promise<Job>} next - Gets the next job from the queu
 * @prop {function(job) => Promise<Job>} finish - Removes a job from the system
 * @prop {function() => Promise<Count>} count - Get the count of all jobs
 * @prop {function() => Promise<Ok>} drop - Clear the queueues
 * @prop {function(string) => Promise<Ok>} clear - Clears one queue
 */
/**
 * A queue is a list of remaing
 * jobs that a consumer can 
 */

 /**
  * @param {QueueDefaults} opts - Queue Options
  * 
  * @return {Queue}
  */
const queue = (opts = {}) => {
    const {
        queueName,
        requeueName,
        config,
        retryStrategy,
    } = queueDefaults(opts)

    const cache = retryStrategy(createCache(config), {
        queueName,
        requeueName
    })

    const {
        push,
        pop,
        remove,
        length,
        drop,
    } = getCacheFunctions(cache)

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
            const unparsedJob = await pop(queueName, requeueName, 100)
            if (unparsedJob) {
                return JSON.parse(unparsedJob)
            }

            return unparsedJob
        },
        // Finish a job taken from the queue
        finish: job => remove(requeueName, -1, JSON.stringify(job)),
        // Get count of both queues
        count: () => Promise.all([
            length(queueName),
            length(requeueName)
        ]).then(([qL, rL]) => ({
            queueLength: qL,
            requeueLength: rL
        })),
        // Clear all queues
        drop: () => Promise.all([
            drop(queueName),
            drop(requeueName)
        ]).then(([d, i]) => ({
            queue: d,
            requeue: i
        })),
        // Clear one queue; defaults to ReadQueue
        clear: (queue = queueName) => drop(queueName) 
    })
}

module.exports = queue