const bodyParser = require('./modules/bodyParsing')
const logging = require('./modules/logging')
const queryString = require('./modules/queryString')
const headers = require('./modules/headers')

// Middleware are functions of
// opts => [middlewareFn]
// middlewareFn :: (req, res, next) => void
const middleware = [
    headers,
    logging,
    bodyParser,
    queryString
]

module.exports = opts => middleware
    .map(fn => fn(opts))
    .reduce((a, c) => a.concat(c))