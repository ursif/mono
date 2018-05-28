const { promisify } = require('util')
const redis = require('redis')
/**
 * 
 * @param {redis.RedisClient} cache 
 */
module.exports = cache => {
    const push = promisify(cache.rpush).bind(cache)
    const pop = promisify(cache.brpoplpush).bind(cache)
    const remove = promisify(cache.lrem).bind(cache)
    const length = promisify(cache.llen).bind(cache)
    const drop = promisify(cache.del).bind(cache)
    const range = promisify(cache.lrange).bind(cache)

    return ({
        push,
        pop,
        remove,
        length,
        drop,
        range,
    })
}