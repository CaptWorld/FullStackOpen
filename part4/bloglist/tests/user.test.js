const assert = require('node:assert')
const { after, test, beforeEach, describe } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const userHelper = require('./user_helper')
const User = require('../models/user')
const mongoose = require('mongoose')

const api = supertest(app)

describe('when there is an initial root user in db', async () => {

    beforeEach(async () => {
        await User.deleteMany({})
        await userHelper.createRootUser()
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

    describe('fails on incorrect user info', () => {
        test('400 error when username length is less than 3', async () => {
            const newUser = {
                name: 'Lokesh',
                username: 'lo',
                password: 'blahblah'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            assert(response.body.error.includes('User validation failed'))

            const usersInDB = await userHelper.usersInDB()
            assert.strictEqual(usersInDB.length, 1)
        })

        test('400 error when password length is less than 3', async () => {
            const newUser = {
                name: 'Lokesh',
                username: 'lokeshvardhan',
                password: 'bl'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            assert(response.body.error.includes('User validation failed'))

            const usersInDB = await userHelper.usersInDB()
            assert.strictEqual(usersInDB.length, 1)
        })

        test('400 error when duplicate username is detected', async () => {
            const newUser = {
                name: 'root',
                username: 'root',
                password: 'root'
            }
            const response = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            assert(response.body.error.includes('expected `username` to be unique'))

            const usersInDB = await userHelper.usersInDB()
            assert.strictEqual(usersInDB.length, 1)
        })
    })
})

after(() => mongoose.connection.close())