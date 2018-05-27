const { v4: uuid } = require('uuid')

/**
 * @typedef {Object} Job
 * 
 * @prop {string} _id - Id of job
 * @prop {Date.now} created_at - Time job created
 */


/**
 * Creates a Job
 * 
 * @param {Object} job - Incoming job
 * @return {Job}
 */
const createJob = (job) => ({
    ...job,
    _id: uuid(),
    created_at: Date.now()
})

module.exports = createJob