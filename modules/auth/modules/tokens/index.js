const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const timeconverter = require('@mck-p/time-converter')

const SALT_ROUNDS = process.env.SALT_ROUNDS || 5
const JWT_SECRET = process.env.JWT_SECRET || 'My super secrete key!'

const createOpToken = (user) => bcrypt.hash(JSON.stringify(user), SALT_ROUNDS)

const createJWT = user => jwt.sign(user, JWT_SECRET, {
    expiresIn: timeconverter
        .from('1 day')
        .to('milliseconds'),
        issuer: '@ursif'
})

const verifyJWT = possibleJWT => jwt.verify(possibleJWT, JWT_SECRET,)

module.exports = {
    createOpToken,
    createJWT,
    verifyJWT
}