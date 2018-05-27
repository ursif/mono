const getCacheFunctions = require('./cacheFunctions')
const createJob = require('../../job')
const defaultLogger = require('../../logger')

module.exports = (cache, {
    queueName,
    requeueName,
    // 1 minute default max
    maxLife = 60 * 1000,
    // 1 second retry default interval
    retryInterval = 1000,
    // default logging
    logger = defaultLogger
}) => {
    const {
        push,
        pop,
        remove,
        length,
        drop,
        range
    } = getCacheFunctions(cache)

    // If the consumer gives us a retryInterval
    // we can setup an interval to try on!
    const interval = retryInterval && setInterval(async () => {
        try {
            // Get a list of the next 10 items to requeue
            const items = await range(requeueName, 0, 10)
            if (!items.length) {
                return logger.debug({
                    title: 'REQUEUE_EMPTY',
                    message: `
                        Currently no items to try again. Good job!
                    `
                })
            }
            // get the items
            items
                .map(JSON.parse)
                .forEach(async ({ created_at, ...item }) => {
                    // and for each one that is out of date
                    if (created_at + maxLife <= Date.now()) {
                        // push it back to the job queue
                        logger.info({
                            title: 'REQUEUE_STALE_ITEM',
                            message: `
                                Currently retrying item: ${JSON.stringify(item)}
                            `
                        })

                        await push(queueName, JSON.stringify(createJob({
                            ...item,
                            isRetry: true,
                            retryCount: (item.retryCount || 0) + 1,
                            last_sent: created_at
                        })))

                        logger.info({
                            title: 'REQUEUE_STALE_ITEM',
                            message: `
                                Requeued item: ${JSON.stringify(item, null, 2)}
                            `
                        })
                        // and remove it from the requeue
                        await remove(requeueName, -1, JSON.stringify({
                            ...item,
                            created_at
                        }))

                        logger.info({
                            title: 'REQUEUE_STALE_REMOVED',
                            message: `
                                Removed Item ${JSON.stringify(item)}
                            `
                        })
                    } else {
                        logger.debug({
                            title: 'REQUEUE_STILL_ALIVE',
                            message: `
                                Current item is okay: ${JSON.stringify(item)}
                            `
                        })
                    }
                })
        } catch (e) {
            logger.error({
                title: 'REQUEUE_CHECK_ERROR',
                message: e.message
            })
        }
    }, retryInterval)

    return cache
}
