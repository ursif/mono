const mongo = require('mongodb')
const { MongoClient } = mongo

const { env } = process
const {
    REST_DB_HOST = 'localhost',
    REST_DB_PORT = 9997,
    REST_DB_NAME = 'ursif_posts',
    REST_SERVER_PORT = 5001,
} = env

const url = `mongodb://${REST_DB_HOST}:${REST_DB_PORT}`

const dbName = REST_DB_NAME

let db

module.exports = {
    // A way to gain reference to the DB
    db: () => db,
    // Connect to the database
    connect: () => new Promise((res, rej) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
            if (err) {
                return rej(err)
            }
        
            // Set the global DB
            db = client.db(dbName)

            res(db)
        })
    })
}