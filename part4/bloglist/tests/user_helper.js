const User = require('../models/user')
const encryptionHelper = require('../utils/encryption_helper')

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const createUser = async (name, username, password) => {
    const passwordHash = await encryptionHelper.hash(password);
    const rootUser = new User({
        name,
        username,
        passwordHash
    })
    return await rootUser.save()
}

const createRootUser = () => createUser('root', 'root', 'root')

const getUserByBlogId = (username, blogId) => {
    return User.findOne({ username, blogs: blogId })
}

module.exports = {
    usersInDB,
    createUser,
    createRootUser,
    getUserByBlogId
}