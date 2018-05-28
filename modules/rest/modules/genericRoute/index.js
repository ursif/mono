const { Router } = require('express')
const { ObjectId } = require('mongodb')
const GenericRoute = new Router()

const DB_ERROR = () => {
    const err =new Error('DB_ERROR')
    
    err.code = 500

    return err
}

const getPost = ({ ops, result }) => {
    if (!result.ok) {
        throw DB_ERROR()
    }

    return ops
}

const getUpdateResult = ({ value, ok }) => {
    if(!ok) {
        throw DB_ERROR()
    }

    return value
}

GenericRoute.get('/', (req, res) => {
    req.db.listCollections()
        .toArray()
        .then(collections => res.json({ data: collections }))
        .catch(err => res.status(400).json({
            error: {
                message: err.message,
                code: err.code
            }
        }))
})

// Query a single collection
GenericRoute.get('/:collection', (req, res) => {
    const query = req.parsedQuery
    const { collection } = req.params

    req.db
        .collection(collection)
        .find(query)
        .toArray()
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Drop a whole collection
GenericRoute.delete('/:collection', (req, res) => {
    req.db.collection(req.params.collection)
        .drop()
        .then(getResult)
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Add a resource or multiple resources
// to a collection
GenericRoute.post('/:collection', (req, res) => {
    const { collection } = req.params
    const { resource, resources } = req.body

    if ((!resources || !Array.isArray(resources)) && !resource) {
        return res.status(400).json({
            error: {
                message: 'No data to insert!'
            }
        })
    }

    if (!resources) {
        return req.db
            .collection(collection)
            .insertOne(resource)
            .then(getPost)
            .then(data => res.json({ data }))
            .catch(error => res.status(400).json({
                error: {
                    message: error.message
                }
            }))
    }

    return req.db
        .collection(collection)
        .insertMany(resources)
        .then(getPost)
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Gets a single resource by ID
GenericRoute.get('/:collection/:id', (req, res) => {
    const { collection, id } = req.params
    console.log(id, 'id?')
    req.db
        .collection(collection)
        .findOne({ _id: new ObjectId(id) })
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Updates a resource by ID
GenericRoute.patch('/:collection/:id', (req, res) => {
    const { collection, id } = req.params
    const { update } = req.body

    req.db
        .collection(collection)
        .findOneAndUpdate({ _id: new ObjectId(id) }, update, {
            upsert: true,
            returnOriginal: false
        })
        .then(getUpdateResult)
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Replaces a resource by ID
GenericRoute.put('/:collection/:id', (req, res) => {
    const { collection, id } = req.params
    const { replacement } = req.body

    req.db
        .collection(collection)
        .findOneAndReplace({ _id: new ObjectId(id) }, replacement, {
            upsert: true,
            returnOriginal: false
        })
        .then(getUpdateResult)
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// Deletes a resource by ID
GenericRoute.delete('/:collection/:id', (req, res) => {
    const { collection, id } = req.params

    req.db
        .collection(collection)
        .findOneAndDelete({ _id: new ObjectId(id) })
        .then(getUpdateResult)
        .then(data => res.json({ data }))
        .catch(error => res.status(400).json({
            error: {
                message: error.message
            }
        }))
})

// The Generic Route is a CRUD
// interface for the MongoDB
module.exports = GenericRoute