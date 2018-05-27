const mongo = require('mongodb')
const { MongoClient } = mongo

const { env } = process
const {
    POSTS_DB_HOST = '0.0.0.0',
    POSTS_DB_PORT = 9998,
    POSTS_DB_NAME = 'ursif_posts',
    POSTS_SERVER_PORT = 5000,
} = env

const url = `mongodb://${POSTS_DB_HOST}:${POSTS_DB_PORT}`

const dbName = POSTS_DB_NAME

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