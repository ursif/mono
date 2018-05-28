const redis = require('redis')
const withDefaults = require('with-defaults')
const { Subject } = require('rxjs')
const { filter, map } = require('rxjs/operators')

const defaultLogger = require('../logger')

const getEventFunctions = require('./modules/eventFunctions')
const getSubscribeFunctions = require('./modules/subscribeFunctions')

const eventsDefaults = withDefaults({
    key: 'ursif_events',
    publisherConfig: {
        host: 'localhost',
        port: 9996
    },
    subscriberConfig: {
        host: 'localhost',
        port: 9996,
    },
    logger: defaultLogger
})

module.exports = (opts = {}) => {
    const { logger, ...options } = eventsDefaults(opts)
    const client = redis.createClient(options.publisherConfig)

    const {
        count,
        publish,
        add,
        range,
        clear,
    } = getEventFunctions(client, {
        bus_name: options.key
    })
    
    const subscriber = redis.createClient(options.subscriberConfig)

    const {
        subscribeTo
    } = getSubscribeFunctions(subscriber)

    return ({
        clear,
        emit: event => add(event)
            .then(() => publish(event)),
        count,
        scan: range,
        listenFor: subscribeTo,
    })
}