const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    response.send(await User.find({}))
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).send(savedUser)
})

module.exports = usersRouter