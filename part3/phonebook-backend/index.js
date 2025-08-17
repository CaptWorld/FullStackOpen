require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('request-body', (req) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))


app.get('/info', (request, respose, next) => {
  Person
    .countDocuments()
    .then(count => respose.send(`Phonebook has info for ${count} people <br /><br /> ${new Date()}`))
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person
    .find({})
    .then(persons => response.send(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findById(id)
    .then(personFound => {
      if (!personFound) {
        return response.status(404).json({
          error: `Person with id ${id} not found`
        })
      }
      response.json(personFound)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

const validate = (name, number) => {
  if (name.trim() === '') {
    return { status: 400, message: 'name is missing' }
  } else if (number.trim() === '') {
    return { status: 400, message: 'number is missing' }
  }
}

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const error = validate(name, number)
  if (error) {
    return response.status(error.status).json({ error: error.message })
  }
  Person
    .findOne({ name })
    .then(personFound => {
      if (personFound) {
        return response.status(409).json({ error: 'Resource already exists' })
      }

      return new Person({ name, number })
        .save()
        .then(savedPerson => response.send(savedPerson))
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  const error = validate(name, number)
  if (error) {
    return response.status(error.status).json({ error: error.message })
  }
  Person
    .findByIdAndUpdate(id, { name, number }, { runValidators: true })
    .then(personUpdated => {
      if (!personUpdated) {
        return response.status(404).json({ error: `Person with id ${id} not found` })
      }
      response.json({ name, number, id })
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server started at port ${PORT}`)