module.exports = ({ getDB, logger }) => [(err, req, res, next) => {
    if (err) {
        logger.error({
            title: `REST_REQUEST_ERROR`,
            message: err.message
        })
    }
}]