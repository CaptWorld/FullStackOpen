import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }
  ])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleNewPersonCreation = (event) => {
    event.preventDefault()
    if (persons.findIndex(person => person.name === newName) !== -1) {
      window.alert(`${newName} is already added to phonebook`)
    } else if (persons.findIndex(person => person.phone === newPhone) !== -1) {
      window.alert(`${newPhone} is already added to phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, phone: newPhone }))
      setNewName('')
      setNewPhone('')
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <h2>add a new</h2>
      <form
        onSubmit={handleNewPersonCreation}
      >
        <div>
          name: <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>
          number: <input
            value={newPhone}
            onChange={(event) => setNewPhone(event.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map(person =>
          <div
            key={person.name}
          >
            {person.name} {person.phone}
          </div>
        )}
      </div>
    </div>
  )
}

export default App