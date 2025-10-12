const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGO_URI)

app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app