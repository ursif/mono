const MongoQS = require('mongo-querystring')
const queryParser = new MongoQS()

module.exports = ({ getDB }) => [(req, res, next) => {
    const db = getDB()
    if (!db) {
        return res.status(500).json({
            error: {
                message: 'Server not ready yet. Something bad happened!'
            }
        })
    }

    req.db = db
    req.parsedQuery = queryParser.parse(req.query || {})

    return next()
}]