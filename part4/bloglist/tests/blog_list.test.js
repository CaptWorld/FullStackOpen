const { test, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const app = require('../app')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const Blog = require("../models/blog")
const mongoose = require("mongoose")


const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({});
    await Promise.all(testHelper.initialBlogs.map(blog => new Blog(blog).save()))
})

test('blogs are returned as JSON', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const blogs = response.body
    assert.strictEqual(blogs.length, testHelper.initialBlogs.length)
})

test('blogs have id field but not _id as identifier', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert.strictEqual(blogs.filter(blog => blog.hasOwnProperty('id') && !blog.hasOwnProperty('_id')).length, testHelper.initialBlogs.length)
})

test('blog can be added', async () => {
    const newBlog = {
        "title": "Not My Life",
        "author": "Lokesh",
        "url": "http://www.lokesh.com",
        "likes": 99999999
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const allBlogs = await testHelper.blogsInDB()
    assert.strictEqual(allBlogs.length, testHelper.initialBlogs.length + 1)

    const newBlogInDB = allBlogs[allBlogs.findIndex(blog => blog.url === newBlog.url)]
    assert.partialDeepStrictEqual(newBlogInDB, newBlog)
})

test('likes of a new blog is set to zero if absent', async () => {
    const newBlog = {
        "title": "Not My Life",
        "author": "Lokesh",
        "url": "http://www.lokesh.com",
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const newBlogResponse = response.body

    const newBlogInDB = await Blog.findById(newBlogResponse.id)

    assert.strictEqual(newBlogInDB.likes, 0)
})

test('failure when title is absent for new blog', async () => {
    const newBlog = {
        "author": "Lokesh",
        "url": "http://www.lokesh.com",
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('400 error when title is absent', async () => {
    const newBlog = {
        "author": "Lokesh",
        "url": "http://www.lokesh.com",
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('400 error when url is absent', async () => {
    const newBlog = {
        "title": "Not My Life",
        "author": "Lokesh",
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('status code of 204 when blog is deleted', async () => {
    let blogsInDB = await testHelper.blogsInDB()
    const blogToDelete = blogsInDB[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    blogsInDB = await testHelper.blogsInDB()
    assert.strictEqual(blogsInDB.length, testHelper.initialBlogs.length - 1)
    assert(!blogsInDB.includes(blog => blog.content === blogToDelete.content))
})

test('status code of 200 with updated details when blog is updated', async () => {
    let blogsInDB = await testHelper.blogsInDB()
    const blogToUpdate = blogsInDB[0];

    const likes = 999

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes })
        .expect(200)

    const blogAfterUpdate = await testHelper.findById(blogToUpdate.id)
    assert.strictEqual(blogAfterUpdate.likes, likes)
})

after(async () => await mongoose.connection.close())