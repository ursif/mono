const { v4: uuid } = require('uuid')

module.exports = () => [(req, res, next) => {
    res.set({
        'X-Are-You-Cool': true,
        'X-Request-Read': Date.now(),
        'X-Request-ID': uuid()
    })

    next()
}]