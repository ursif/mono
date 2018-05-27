const express = require('express')
const { genericRoute, database, middleware } = require('./modules')

const { env } = process
const { POSTS_SERVER_PORT = 5000 } = env

const app = express()

app.use(...middleware({ getDB: database.db }))
app.use('/', genericRoute)

database
    .connect()
    .then(() => {
       app.listen(POSTS_SERVER_PORT, () => console.log('Posts Listening!'))
    })