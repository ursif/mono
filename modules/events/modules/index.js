const createStore = require('./store')
const { ofType } = require('redux-observable')
const api = require('./api')

module.exports = {
    ofType,
    createStore,
    api
}