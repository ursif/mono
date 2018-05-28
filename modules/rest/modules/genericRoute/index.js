const route = require('./modules/router')
const objectId = require('./modules/objectId')
const GenericRoute = route()

const {
    JSONAPI,
    isBadPost,
    isBadPut,
    isBadPatch,
    DB_ERROR,
    getPost,
    getUpdateResult
} = require('./modules/utils')

GenericRoute.get('/', (req, res, next) => {
    req.db
        .listCollections()
        .toArray()
        .then(JSONAPI.response(res,{
            quote: 'Thanks for stopping by!'
        }))
        .then(() => next())
        .catch(JSONAPI.error(res, {
            quote: 'You got served!'
        }))
})

// Query a single collection
GenericRoute.get('/:collection', (req, res, next) => {
    const query = req.parsedQuery
    const { collection } = req.params

    req.db
        .collection(collection)
        .find(query)
        .toArray()
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Drop a whole collection
GenericRoute.delete('/:collection', (req, res, next) => {
    req.db.collection(req.params.collection)
        .drop()
        .then(getResult)
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Add a resource or multiple resources
// to a collection
GenericRoute.post('/:collection', (req, res, next) => {
    const { collection } = req.params

    if (isBadPost(req.body)) {
        return JSONAPI.error(res, {
            placement: 'COLLECTION_POST'
        })({
            message: 'You must give me a Body.resource or a Body.resources value'
        })
    }

    const { resource, resources } = req.body

    if (!resources) {
        return req.db
            .collection(collection)
            .insertOne(resource)
            .then(getPost)
            .then(JSONAPI.response(res))
            .then(() => next())
            .catch(JSONAPI.error(res))
    }

    return req.db
        .collection(collection)
        .insertMany(resources)
        .then(getPost)
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Gets a single resource by ID
GenericRoute.get('/:collection/:id', (req, res, next) => {
    const { collection, id } = req.params

    req.db
        .collection(collection)
        .findOne({ _id: objectId(id) })
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Updates a resource by ID
GenericRoute.patch('/:collection/:id', (req, res, next) => {
    const { collection, id } = req.params

    if (isBadPatch(req.body)) {
        return JSONAPI.error(res, {
            position: 'COLLECTION_PATCH'
        })({
            message: 'You must give me a Body.update value'
        })
    }

    const { update } = req.body

    req.db
        .collection(collection)
        .findOneAndUpdate({ _id: objectId(id) }, update, {
            upsert: true,
            returnOriginal: false
        })
        .then(getUpdateResult)
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Replaces a resource by ID
GenericRoute.put('/:collection/:id', (req, res, next) => {
    const { collection, id } = req.params

    if (isBadPut(req.body)) {
        return JSONAPI.error(res, {
            position: 'COLLECTION_PUT'
        })({
            message: 'You must give me a Body.replacement'
        })
    }

    const { replacement } = req.body

    req.db
        .collection(collection)
        .findOneAndReplace({ _id: objectId(id) }, replacement, {
            upsert: true,
            returnOriginal: false
        })
        .then(getUpdateResult)
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// Deletes a resource by ID
GenericRoute.delete('/:collection/:id', (req, res, next) => {
    const { collection, id } = req.params

    req.db
        .collection(collection)
        .findOneAndDelete({ _id: objectId(id) })
        .then(getUpdateResult)
        .then(JSONAPI.response(res))
        .then(() => next())
        .catch(JSONAPI.error(res))
})

// The Generic Route is a CRUD
// interface for the MongoDB
module.exports = GenericRoute