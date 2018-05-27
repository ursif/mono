/**
 * Checks if a logging level can run
 * 
 * @param {string} level - Level trying to run
 * @return {Boolean} - If this level can run right now
 */
const canRun = (level) => {
    const defaultLevel = 'debug'
    const debugLevel = () => (process.env.DEBUG_LEVEL || defaultLevel).toLowerCase()
    const levels = {
        debug: () => ([
            'debug'
        ].indexOf(debugLevel())) > -1,
        info: () => ([
            'debug',
            'info'
        ].indexOf(debugLevel())) > -1,
        warn: () => ([
            'debug',
            'info',
            'warn'
        ].indexOf(debugLevel())) > -1,
        error: () => ([
            'debug',
            'info',
            'warn',
            'error'
        ].indexOf(debugLevel())) > -1
    }

    const currentLevel = levels.hasOwnProperty(level) ? level : defaultLevel

    return levels[currentLevel]()
}

/**
 * Creates a formatted log message
 * 
 * @example: Log Format: `[LEVEL]:[TIMESTAMP]:[title]:<message>
 * @return {string}
 */
const createLog = ({ title = '', message = '', level = 'debug' }) =>
    `[${level.toUpperCase()}]:[${Date.now()}]:[${title}]:${message}` 

/**
 * @typedef {Object} LogMessage
 * 
 * @prop {string} title - Title of the message
 * @prop {string} message - The message of the log message
 */

/**
 * @typedef {Object} Logger - Logger Instance
 * 
 * @prop {function(LogMessage) => void} debug
 * @prop {function(LogMessage) => void} info
 * @prop {function(LogMessage) => void} warn
 * @prop {function(LogMessage) => void} error
 *  
 */


/**
 * @type {Logger}
 */
const logger = [
    'debug',
    'info',
    'warn',
    'error'
].reduce((a, c) => ({
    ...a,
    [c]: ({
        title = `${c.toUpperCase()}:ursif`,
        message,
    }) => canRun(c) && console.log(createLog({
        title,
        message,
        level: c
    }))
}), {})

module.exports = logger