const { createStore } = require('redux')
const middleware = require('./middleware')

// Basic Redux Store
// Holds API, Services, Etc
// Using as Dependency Injection
// into our epics
module.exports = ({ intialState = {}, epics, reducer }) => createStore(
    reducer || ((s = intialState) => s),
    middleware({ epics })
)