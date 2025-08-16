require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

morgan.token('request-body', (req) => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))


app.get('/info', (request, respose) => {
    respose.send(`Phonebook has info for ${persons.length} people <br /><br /> ${new Date()}`)
})

app.get('/api/persons', (request, response, next) => {
    Person
        .find({})
        .then(persons => response.send(persons))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).json({
            error: `Person with id ${id} not found`
        })
    }
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
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
    new Person({ name, number })
        .save()
        .then(savedPerson => response.send(savedPerson))
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server started at port ${PORT}`)