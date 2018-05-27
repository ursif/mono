const { Router } = require('express')

const GenericRoute = new Router()

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
    req.db.drop(req.params.collection)
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
    
    req.db
        .collection(collection)
        .findOne({ _id: id })
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
        .findOneAndUpdate({ _id: id }, update, {
            upsert: true,
            returnOriginal: false
        })
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
        .findOneAndReplace({ _id: id }, replacement, {
            upsert: true,
            returnOriginal: false
        })
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
        .collect(collection)
        .findOneAndDelete({ _id: id })
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