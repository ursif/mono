const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const timeconverter = require('@mck-p/time-converter')

const AUTH_SALT_ROUNDS = process.env.SALT_ROUNDS || 5
const JWT_SECRET = process.env.JWT_SECRET || 'My super secret key!'

const createOpToken = (user) => bcrypt.hash(`
OPAQUE_REFERENCE_TOKEN:
${JSON.stringify(user)}:
${Date.now()}
`, AUTH_SALT_ROUNDS)

const createJWT = user => jwt.sign(user, JWT_SECRET, {
    expiresIn: timeconverter
        .from('1 day')
        .to('milliseconds'),
        issuer: '@ursif'
})

const verifyJWT = possibleJWT => jwt.verify(possibleJWT, JWT_SECRET, {
    issuer: '@ursif'
})

module.exports = {
    createOpToken,
    createJWT,
    verifyJWT
}