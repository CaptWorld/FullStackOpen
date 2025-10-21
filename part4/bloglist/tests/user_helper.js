const User = require('../models/user')
const bcrypt = require('bcrypt')

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const createRootUser = async () => {
    const passwordHash = await bcrypt.hash('root', 10);
    const rootUser = new User({
        name: 'root',
        username: 'root',
        passwordHash
    })
    return await rootUser.save()
}

module.exports = {
    usersInDB,
    createRootUser
}