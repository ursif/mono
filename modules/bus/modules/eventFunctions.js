const redis = require('redis')
const { promisify } = require('util')
const { v4: uuid } = require('uuid')

/**
 * Event Log Interface
 * @param {redis.RedisClient} bus - Event Bus
 */
module.exports = (bus, { bus_name }) => {

    const length = promisify(bus.zcount).bind(bus)
    const publish = promisify(bus.publish).bind(bus)
    const add = promisify(bus.zadd).bind(bus)
    const range = promisify(bus.zrangebyscore).bind(bus)
    const drop = promisify(bus.del).bind(bus)

    return ({
        publish: (event) => {
            const { type = 'ursif/INTERNAL' } = event

            return publish(type, JSON.stringify({
                event,
                published_at: Date.now()
            }))
        },
        add: (event) => add(bus_name, Date.now(), JSON.stringify({
            event,
            added_at: Date.now()
        })),
        range: (min = -Infinity, max = Infinity) => range(bus_name, min, max),
        count: () => length(bus_name, -Infinity, Infinity),
        clear: () => drop(bus_name),
        bus: () => bus
    })
}