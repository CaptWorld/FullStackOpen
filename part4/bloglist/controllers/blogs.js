const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const encryptionHelper = require('../utils/encryption_helper')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const user = request.user
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const blogId = request.params.id
    const blogToDelete = await Blog.findById(blogId)
    if (blogToDelete) {
        if (blogToDelete.user.toString() !== user._id.toString()) {
            return response.status(403).send({ error: "Permission denied" })
        }
        await Blog.deleteOne({ _id: blogToDelete._id })
        user.blogs = user.blogs.filter(blog => blog !== blogId)
        await user.save()
    }
    response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const user = request.user
    const id = request.params.id
    let { likes } = request.body
    if (typeof likes !== 'number') {
        response.status(400).send({ error: `likes should be a number` })
    }
    const blogToUpdate = await Blog.findById(id)
    if (blogToUpdate) {
        if (blogToUpdate.user.toString() !== user._id.toString()) {
            return response.status(403).send({ error: "Permission denied" })
        }
        const blogAfterUpdate = await Blog.findByIdAndUpdate(blogToUpdate._id, { likes }, { returnDocument: 'after' })
        response.send(blogAfterUpdate)
    } else {
        response.status(404).send({ error: "Blog not found" })
    }
})

module.exports = blogsRouter