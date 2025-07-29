import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }
  ])
  const [filter, setFilter] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        setFilter={setFilter}
      />
      <h2>add a new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
      />
      <h2>Numbers</h2>
      <Persons
        filter={filter}
        persons={persons}
      />
    </div>
  )
}

export default App