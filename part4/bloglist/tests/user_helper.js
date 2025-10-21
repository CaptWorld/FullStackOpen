const User = require('../models/user')
const encryptionHelper = require('../utils/encryption_helper')

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const createRootUser = async () => {
    const passwordHash = await encryptionHelper.hash('root');
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