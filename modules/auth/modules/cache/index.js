const redis = require('redis')
// Reference to Cache
const cache = redis.createClient({
    port: process.env.AUTH_REDIS_PORT || 9999
})
// API for cache
module.exports = {
    get: (key) => new Promise((res, rej) => {
        cache.get(key, (err, d) => err ? rej(err) : res(d))
    }),
    set: (token, jwt) => new Promise((res, rej) => {
        cache.set(token, jwt, (err, d) => err ? rej(err) : res(d))
    }),
    has: (token) => new Promise((res, rej) => {
        cache.has(token, (e, d) => e ? rej(e) : res(d))
    }),
    delete: (token) => new Promise((res, rej) => {
        cache.delete(token, (e, d) => e ? rej(e) : res(d))
    })
}