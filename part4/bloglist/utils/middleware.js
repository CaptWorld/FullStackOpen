const User = require('../models/user')
const encryptionHelper = require('../utils/encryption_helper')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token' })
    } else if (error.name === 'CastError') {
        return response.status(404).json({ error: 'Not found' })
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
    request.token = encryptionHelper.extractJWTToken(request)
    next()
}

const userExtractor = async (request, response, next) => {
    const token = encryptionHelper.decodeJWTToken(request.token)
    if (!(token && token.id)) {
        return response.status(401).send({ error: "Invalid token" })
    }
    const user = await User.findById(token.id)
    if (!user) {
        return response.status(404).send({ error: "User not found" })
    }
    request.user = user
    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}