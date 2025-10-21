const usersRouter = require('express').Router()
const encryptionHelper = require('../utils/encryption_helper')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1})
    response.send(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    if (!username || username.length < 3 || !password || password.length < 3) {
        return response.status(400).send({error: 'User validation failed'})
    } 

    const passwordHash = await encryptionHelper.hash(password, 10)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).send(savedUser)
})

module.exports = usersRouter