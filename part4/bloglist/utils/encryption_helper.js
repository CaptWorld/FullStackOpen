const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('./config')

const hash = async (password) => {
    return await bcrypt.hash(password, 10);
}

const compare = async (actualString, expectedHash) => {
    return await bcrypt.compare(actualString, expectedHash)
}

const generateJWT = (data) => {
    return jwt.sign(data, config.JWT_SECRET)
}

const extractJWTToken = (request) => {
    const auth = request.get('Authorization');
    if (auth && auth.startsWith('Bearer ')) {
        return auth.replace('Bearer ', '')
    }
}

const decodeJWTToken = (token) => jwt.verify(token, config.JWT_SECRET)

module.exports = {
    hash,
    compare,
    generateJWT,
    extractJWTToken,
    decodeJWTToken
}