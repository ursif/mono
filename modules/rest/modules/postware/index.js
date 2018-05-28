
const logging = require('./modules/logging')

// Middleware are functions of
// opts => [middlewareFn]
// middlewareFn :: (req, res, next) => void
const middleware = [
    logging,
]

module.exports = opts => middleware
    .map(fn => fn(opts))
    .reduce((a, c) => a.concat(c))