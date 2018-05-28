const redis = require('redis')

module.exports = ({ port, host }) => redis.createClient({
    port,
    host,
})