const app = require('../app')
const supertest = require('supertest')
const { after, test, before, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const userHelper = require('./user_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when root user exists initially', async () => {
    before(async () => {
        await User.deleteMany({})
        await userHelper.createRootUser()
    })

    test('token creation for root user', async () => {
        const username = 'root';
        const password = 'root';
        const result = await api
            .post('/api/login')
            .send({ username, password })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(result.body.username, username)
        assert(result.body.token)
    })

    test('failure in token creation for non existing user', async () => {
        const username = 'dummy';
        const password = 'dummy';
        const result = await api
            .post('/api/login')
            .send({ username, password })
            .expect(401)
            .expect('Content-Type', /application\/json/)
        assert(result.body.error.includes('Invalid username or password'))
    })
})


after(() => mongoose.connection.close())