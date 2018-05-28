const logger = require('../logger')

const { bootstrap } = require('./modules')

bootstrap({ logger })
    .then(({ app, database }) => console.log('Started!'))