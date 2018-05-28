const logger = require('../../../../logger')

module.exports = () => [(req, res, next) => {
    logger.info({
        title: `REST_REQUEST:${res.get('X-Request-ID')}`,
        message: `Incoming ${req.method} for ${req.originalUrl} from ${req.ip}`
    })

    next()
}]