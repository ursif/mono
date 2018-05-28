const logger = require('../../../../logger')

module.exports = () => [(req, res, next) => {
    const start = res.get('X-Request-Read')
    const requestID = res.get('X-Request-ID')

    if(start) {
        const length = Date.now() - Number(start)

        logger.info({
            title: 'REST_REQUEST_FINISHED',
            message: `The request ${requestID} took ${length}ms`
        })
    }

    next()
}]