const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const blogInDB = await blog.save()
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