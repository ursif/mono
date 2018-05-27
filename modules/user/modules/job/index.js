const { v4: uuid } = require('uuid')

const createJob = (job) => ({
    ...job,
    _id: uuid(),
    created_at: Date.now()
})

module.exports = createJob