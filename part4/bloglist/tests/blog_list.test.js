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
    assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
})

after(async () => await mongoose.connection.close())