import { useEffect, useState } from 'react'
import phoneService from './services/phones'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setError] = useState(false)

  useEffect(() => {
    phoneService
      .getAll()
      .then(setPersons)
  }, [])

  const notify = (newMessage, isError) => {
    setMessage(newMessage)
    setError(isError)
    setTimeout(() => setMessage(null), 4000)
  }

  const setNewPerson = async (name, number) => {
    const indexOfpersonWithSameName = persons.findIndex(person => person.name === name);
    if (indexOfpersonWithSameName !== -1) {
      if (confirm(`${name} is already added to phonebook, replace the old number with new one?`)) {
        return phoneService
          .updatePerson({ id: persons[indexOfpersonWithSameName].id, name, number })
          .then(updatedPerson => setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)))
          .then(() => notify(`Updated ${number} of ${name}`, false))
          .then(() => true)
          .catch(error => {
            console.error(error);
            notify(`Failed to update number of ${name} to ${number}. check logs for error`, true)
            return false
          });
      } else {
        return new Promise((resolve,) => resolve(false))
      }
    } else {
      const indexOfpersonWithSameNumber = persons.findIndex(person => person.number === number);
      if (indexOfpersonWithSameNumber !== -1) {
        if (confirm(`${number} is already added to phonebook, replace the old name with new one?`)) {
          return phoneService
            .updatePerson({ id: persons[indexOfpersonWithSameNumber].id, name, number })
            .then(updatedPerson => setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)))
            .then(() => notify(`Updated ${name} of ${number}`, false))
            .then(() => true)
            .catch(error => {
              console.error(error);
              notify(`Failed to update name of ${number} to ${name}. check logs for error`, true)
              return false
            });
        } else {
          return new Promise((resolve,) => resolve(false))
        }
      } else {
        return phoneService
          .addPerson({ name, number })
          .then(newPerson => setPersons(persons.concat(newPerson)))
          .then(() => notify(`Added ${name} with ${number}`, false))
          .then(() => true)
          .catch(error => {
            console.error(error);
            notify(`Failed to add person ${name}. check logs for error`, true)
            return false
          });
      }
    }

  }

  const handleDelete = (id) => {
    phoneService
      .deletePerson(id)
      .then(() => {
        notify(`Successfully deleted`, false)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch((error) => {
        console.error(error)
        notify(`Failed to delete person with id ${id}. check logs for error`, true)
      })
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={message}
        error={isError}
      />
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
        persons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App