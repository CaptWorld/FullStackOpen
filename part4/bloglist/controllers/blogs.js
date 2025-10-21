const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    // Use aggregation query to get Random user instead of utilizing findOne query
    const userIds = await User.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }])
    if (!userIds.length) {
        return response.status(404).send({ error: "No user found to assign this blog to" })
    }
    const user = await User.findById(userIds[0]._id)
    if (!user) {
        return response.status(404).send({ error: "No user found to assign this blog to" })
    }
    const { title, author, url, likes } = request.body
    const blog = new Blog({
        title,
        author,
        url,
        likes,
        user: user._id
    })

    const blogInDB = await blog.save()

    user.blogs = user.blogs.concat(blogInDB._id)
    await user.save()

    response.status(201).json(blogInDB)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    let { likes } = request.body
    if (typeof likes !== 'number') {
        response.status(400).send({ error: `likes should be a number` })
    }
    const blogAfterUpdate = await Blog.findByIdAndUpdate(id, { likes }, { returnDocument: 'after' })
    response.send(blogAfterUpdate)
})

module.exports = blogsRouter