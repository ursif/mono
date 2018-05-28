const mongo = require('mongodb')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const MongoQS = require('mongo-querystring')
const { ObjectId } = mongo

const queryParser = new MongoQS()

// Returns an array of middleware
// to add before the route
module.exports = ({ getDB }) => [
    morgan('common'),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    (req, res, next) => {
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