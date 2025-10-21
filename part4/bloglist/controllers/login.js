const loginRouter = require('express').Router()
const User = require('../models/user')
const encryptionHelper = require('../utils/encryption_helper')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const isPasswordCorrect = user ? await encryptionHelper.compare(password, user.passwordHash) : false
    if (!(user && isPasswordCorrect)) {
        return response.status(401).send({error: 'Invalid username or password'})
    }
    const data = {
        username,
        id: user._id
    }
    const token = encryptionHelper.generateJWT(data)
    response.status(200).send({
        username,
        name: user.name,
        token
    })
})

module.exports = loginRouter