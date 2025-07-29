import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      phone: '040-1234567'
    }
  ])
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

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map(person =>
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