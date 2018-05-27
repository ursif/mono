const express = require('express')
const { genericRoute, database, middleware } = require('./modules')

const { env } = process
const { REST_SERVER_PORT = 5001 } = env

const app = express()

// Add middleware
app.use(...middleware({ getDB: database.db }))
// Add CRUD routes
app.use('/', genericRoute)

database
    // Connect to the database
    .connect()
    .then(() => {
        // then start the server
        app.listen(
            REST_SERVER_PORT,
            () =>
                console.log(
                    'Posts Listening at http://localhost:%s',
                    REST_SERVER_PORT)
                )
    })