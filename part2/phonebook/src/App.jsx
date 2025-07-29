import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const handleNewNoteCreation = (event) => {
    event.preventDefault()
    if (persons.findIndex(person => person.name === newName) !== -1) {
      window.alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({ name: newName }))
      setNewName('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form
        onSubmit={handleNewNoteCreation}
      >
        <div>
          name: <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
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
            {person.name}
          </div>
        )}
      </div>
    </div>
  )
}

export default App