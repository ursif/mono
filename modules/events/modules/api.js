const fetch = require('node-fetch')

const json = (...args) => fetch(...args).then(x => x.json())
const text = (...args) => fetch(...args).then(x => x.text())

const queryHeaders = {
    'Accept': 'application/json'
}

const updateHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

module.exports = {
    get: (url) => json(url, {
        headers: queryHeaders
    }),
    post: (url, data) => json(url, {
        method: 'POST',
        headers: updateHeaders,
        body: JSON.stringify(data)
    }),
    patch: (url, data) => json(url, {
        method: 'PATCH',
        headers: updateHeaders,
        body: JSON.stringify(data)
    }),
    put: (url, data) => json(url, {
        method: 'PUT',
        headers: updateHeaders,
        body: JSON.stringify(data)
    }),
    delete: (url, data) => json(url, {
        method: 'DELETE',
        headers: updateHeaders,
        body: JSON.stringify(data)
    }),
    fetch,
    json,
    text
}