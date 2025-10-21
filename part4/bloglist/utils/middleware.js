const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) { 
        return response.status(400).json({ error: 'expected `username` to be unique' }) 
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token' }) 
    }
    next(error)
}

module.exports = {
    errorHandler
}