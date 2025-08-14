const express = require('express')

const app = express()

app.use(express.json())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/info', (request, respose) => {
    respose.send(`Phonebook has info for ${persons.length} people <br /><br /> ${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => String(Math.trunc(Math.random() * Number.MAX_SAFE_INTEGER))

const validate = (newPerson) => {
    if (newPerson.name.trim() === '') {
        return { status: 400, message: 'name is missing' }
    } else if (newPerson.number.trim() === '') {
        return { status: 400, message: 'number is missing' }
    } else if (persons.find(person => person.name === newPerson.name)) {
        return { status: 409, message: 'name must be unique' }
    }
}

app.post('/api/persons', (request, response) => {
    const person = request.body
    const error = validate(person)
    if (error) {
        return response.status(error.status).json({ error: error.message })
    }
    person.id = generateId()
    persons = persons.concat(person)
    response.send(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server started at port ${PORT}`)