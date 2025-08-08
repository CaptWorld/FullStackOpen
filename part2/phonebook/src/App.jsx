import { useEffect, useState } from 'react'
import phoneService from './services/phones'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    phoneService
      .getAll()
      .then(setPersons)
  }, [])

  const setNewPerson = async (name, number) => {
    if (persons.findIndex(person => person.name === name) !== -1) {
      window.alert(`${name} is already added to phonebook`)
      return new Promise((resolve,) => resolve(false))
    } else if (persons.findIndex(person => person.number === number) !== -1) {
      window.alert(`${number} is already added to phonebook`);
      return new Promise((resolve,) => resolve(false))
    } else {
      return phoneService
        .addPerson({id: persons.length + 1, name, number})
        .then(newPerson => setPersons(persons.concat(newPerson)))
        .then(() => true)
        .catch(error => {
          console.error(error);
          window.alert(`Failed to add person. check logs for error`)
          return false
        });
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        setFilter={setFilter}
      />
      <h2>add a new</h2>
      <PersonForm
        setNewPerson={setNewPerson}
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