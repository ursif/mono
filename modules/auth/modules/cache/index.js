// Reference to Cache
const cache = new Map()
// API for cache
module.exports = {
    get: (...args) => Promise.resolve(cache.get(...args)),
    set: (...args) => Promise.resolve(cache.set(...args)),
    has: (...args) => Promise.resolve(cache.has(...args)),
    delete: (...args) => Promise.resolve(cache.delete(...args))
}