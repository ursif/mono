const defaultLogger = require('../../logger')

const genericRoute = require('./genericRoute')
const database = require('./database')
const preware = require('./preware')
const postware = require('./postware')

/**
 * Bootstraps an app instance,
 * returning Promise<{ App, Database }>
 * 
 * Logs error but does not throw
 */
const bootstrap = ({ appInstance, logger = defaultLogger }) => {
    const { env } = process
    const { REST_SERVER_PORT = 5001 } = env

    const app = appInstance || require('express')()

    const middlewareCongif = {
        getDB: database.db,
        logger
    }
    // Add pre-route middleware
    app.use(...preware(middlewareCongif))
    // Add CRUD route
    app.use('/', genericRoute)
    // Add post-route middleware
    app.use(...postware(middlewareCongif))

    return database
        // Connect to the database
        .connect()
        .then(() =>
            // then start the server
            new Promise((res) => {
                app.listen(
                    REST_SERVER_PORT,
                    () => {
                        logger.info({
                            title: 'REST_START',
                            message: `REST Service Started at http://localhost:${REST_SERVER_PORT}`
                        })

                        res({
                            app,
                            database,
                        })
                    })
            })
        )
        .catch(err => {
            logger.error({
                title: 'DATABASE_CONNECT_ERROR',
                message: err.message
            })
            
            return ({
                app,
                database,
            })
        })
}

module.exports = {
    database,
    genericRoute,
    preware,
    postware,
    bootstrap
}