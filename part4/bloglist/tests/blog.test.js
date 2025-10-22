const { test, beforeEach, after, describe } = require("node:test")
const assert = require("node:assert")
const app = require('../app')
const supertest = require('supertest')
const testHelper = require('./test_helper')
const userHelper = require('./user_helper')
const Blog = require("../models/blog")
const User = require("../models/user")
const mongoose = require("mongoose")


const api = supertest(app)


describe('when there is root user initially with few blogs associated with it', async () => {

    const generateTokenFor = async (username, password) => {
        const loginResponse = await api
            .post('/api/login')
            .send({ username, password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        return loginResponse.body.token
    }

    const generateTokenForRootUser = async () => {
        return generateTokenFor('root', 'root')
    }

    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});
        const rootUser = await userHelper.createRootUser();
        const savedBlogs = await Promise.all(testHelper.initialBlogs.map(blog => new Blog({ ...blog, user: rootUser._id }).save()))
        rootUser.blogs = savedBlogs.map(savedBlog => savedBlog._id)
        await rootUser.save()
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

    describe('scenarios without token in the header', async () => {
        test("blog cannot be added", async () => {
            const newBlog = {
                "title": "Not My Life",
                "author": "Lokesh",
                "url": "http://www.lokesh.com",
                "likes": 99999999
            }
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(result.body.error, 'Invalid token')

            const allBlogs = await testHelper.blogsInDB()
            assert.strictEqual(allBlogs.length, testHelper.initialBlogs.length)
        })

        test("blog cannot be deleted", async () => {
            let blogsInDB = await testHelper.blogsInDB()
            const blogToDelete = blogsInDB[0];

            const result = await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)
            assert(result.body.error === 'Invalid token')
        })

        test('blog cannot be updated', async () => {
            let blogsInDB = await testHelper.blogsInDB()
            const blogToUpdate = blogsInDB[0];

            const likes = 999

            const result = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ likes })
                .expect(401)
            assert(result.body.error === 'Invalid token')
        })
    })

    describe('scenarios with invalid token in the header', async () => {
        test("blog cannot be added", async () => {
            const newBlog = {
                "title": "Not My Life",
                "author": "Lokesh",
                "url": "http://www.lokesh.com",
                "likes": 99999999
            }
            const result = await api
                .post('/api/blogs')
                .send(newBlog)
                .set('Authorization', 'Bearer blah')
                .expect(401)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(result.body.error, 'Invalid token')

            const allBlogs = await testHelper.blogsInDB()
            assert.strictEqual(allBlogs.length, testHelper.initialBlogs.length)
        })

        test("blog cannot be deleted", async () => {
            let blogsInDB = await testHelper.blogsInDB()
            const blogToDelete = blogsInDB[0];

            const result = await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', 'Bearer blah')
                .expect(401)
            assert(result.body.error === 'Invalid token')
        })

        test('blog cannot be updated', async () => {
            let blogsInDB = await testHelper.blogsInDB()
            const blogToUpdate = blogsInDB[0];

            const likes = 999

            const result = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ likes })
                .set('Authorization', 'Bearer blah')
                .expect(401)
            assert(result.body.error === 'Invalid token')
        })
    })

    describe('scenarios with valid token in the header', async () => {

        describe('blog addition scenarios', async () => {
            test("blog can be added and user is populated correctly", async () => {
                const token = await generateTokenForRootUser()
                const newBlog = {
                    "title": "Not My Life",
                    "author": "Lokesh",
                    "url": "http://www.lokesh.com",
                    "likes": 99999999
                }
                const result = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)
                const savedBlog = result.body
                const blogsInDB = await testHelper.blogsInDB()
                assert.strictEqual(blogsInDB.length, testHelper.initialBlogs.length + 1)

                const savedBlogInDB = blogsInDB[blogsInDB.findIndex(blog => blog.id === savedBlog.id)]
                assert.partialDeepStrictEqual(savedBlogInDB, newBlog)

                const user = await userHelper.getUserByBlogId('root', savedBlogInDB.id)
                assert(user)
            })

            test('likes of a new blog is set to zero if absent', async () => {
                const token = await generateTokenForRootUser()
                const newBlog = {
                    "title": "Not My Life",
                    "author": "Lokesh",
                    "url": "http://www.lokesh.com",
                }
                const response = await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                const newBlogResponse = response.body

                const newBlogInDB = await Blog.findById(newBlogResponse.id)

                assert.strictEqual(newBlogInDB.likes, 0)
            })

            test('failure when title is absent for new blog', async () => {
                const token = await generateTokenForRootUser()
                const newBlog = {
                    "author": "Lokesh",
                    "url": "http://www.lokesh.com",
                }
                await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400)
            })

            test('400 error when title is absent', async () => {
                const token = await generateTokenForRootUser()
                const newBlog = {
                    "author": "Lokesh",
                    "url": "http://www.lokesh.com",
                }
                await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400)
            })

            test('400 error when url is absent', async () => {
                const token = await generateTokenForRootUser()
                const newBlog = {
                    "title": "Not My Life",
                    "author": "Lokesh",
                }
                await api
                    .post('/api/blogs')
                    .send(newBlog)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(400)
            })

        })

        describe('blog deletion scenarios', async () => {

            test("error status code of 403 when the blog of root user, is deleted by different user", async () => {
                await userHelper.createUser('dummy', 'dummy', 'dummy')
                const token = await generateTokenFor('dummy', 'dummy')
                let blogsInDB = await testHelper.blogsInDB()
                const blogToDelete = blogsInDB[0];

                const result = await api
                    .delete(`/api/blogs/${blogToDelete.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(403)
                    .expect('Content-Type', /application\/json/)

                assert.strictEqual(result.body.error, 'Permission denied')

                // Verify that there are no side effects
                blogsInDB = await testHelper.blogsInDB()
                assert.strictEqual(blogsInDB.length, testHelper.initialBlogs.length)

                assert(await userHelper.getUserByBlogId('root', blogToDelete.id))
            })

            test("status code of 204 when the blog of root user, is deleted by root user", async () => {
                const token = await generateTokenForRootUser()
                let blogsInDB = await testHelper.blogsInDB()
                const blogToDelete = blogsInDB[0];

                await api
                    .delete(`/api/blogs/${blogToDelete.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .expect(204)

                blogsInDB = await testHelper.blogsInDB()
                assert.strictEqual(blogsInDB.length, testHelper.initialBlogs.length - 1)
                assert(!blogsInDB.includes(blog => blog.content === blogToDelete.content))

                assert(!await userHelper.getUserByBlogId('root', blogToDelete._id))
            })
        })

        describe('blog updation scenarios', async () => {

            test("error status code of 403 without update when root user's blog is being updated by different user", async () => {
                await userHelper.createUser('dummy', 'dummy', 'dummy')
                const token = await generateTokenFor('dummy', 'dummy')
                let blogsInDB = await testHelper.blogsInDB()
                const blogToUpdate = blogsInDB[0];

                const likes = 999

                const result = await api
                    .put(`/api/blogs/${blogToUpdate.id}`)
                    .send({ likes })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(403)

                assert.strictEqual(result.body.error, 'Permission denied')
            })

            test("status code of 200 with updated details when root user's blog is being updated by root user", async () => {
                const token = await generateTokenForRootUser()
                let blogsInDB = await testHelper.blogsInDB()
                const blogToUpdate = blogsInDB[0];

                const likes = 999

                await api
                    .put(`/api/blogs/${blogToUpdate.id}`)
                    .send({ likes })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(200)

                const blogAfterUpdate = await testHelper.findById(blogToUpdate.id)
                assert.strictEqual(blogAfterUpdate.likes, likes)
            })

            test("status code of 404 when blog does not exist", async () => {
                const token = await generateTokenForRootUser()
                const result = await api
                    .put('/api/blogs/dummy')
                    .send({ likes: 999 })
                    .set('Authorization', `Bearer ${token}`)
                    .expect(404)

                assert(result.body.error.toLowerCase().includes("not found"))
            })
        })
    })
})


after(async () => await mongoose.connection.close())