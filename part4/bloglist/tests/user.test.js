const assert = require('node:assert')
const { after, test, beforeEach, describe } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const userHelper = require('./user_helper')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is an initial root user in db', async () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('root', 10);
        const rootUser = new User({
            name: 'root',
            username: 'root',
            passwordHash
        })
        await rootUser.save()
    })

    test('get api returns proper json', async () => {
        const result = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(result.body.length, 1)
    })

    test('new user can be added', async () => {
        const newUser = {
            name: 'Lokesh',
            username: 'lokeshvardhan',
            password: 'blahblah'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersInDB = await userHelper.usersInDB()

        assert.strictEqual(usersInDB.length, 2)
        assert(usersInDB.map(user => user.username).includes(newUser.username))
    })
})


after(() => mongoose.connection.close())