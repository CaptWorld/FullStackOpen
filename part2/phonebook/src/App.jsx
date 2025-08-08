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
    const indexOfpersonWithSameName = persons.findIndex(person => person.name === name);
    if (indexOfpersonWithSameName !== -1) {
      if (confirm(`${name} is already added to phonebook, replace the old number with new one?`)) {
        return phoneService
          .updatePerson({ id: persons[indexOfpersonWithSameName].id, name, number })
          .then(updatedPerson => setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person)))
          .then(() => true)
          .catch(error => {
            console.error(error);
            alert(`Failed to add person. check logs for error`)
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
            .then(() => true)
            .catch(error => {
              console.error(error);
              alert(`Failed to add person. check logs for error`)
              return false
            });
        } else {
          return new Promise((resolve,) => resolve(false))
        }
      } else {
        return phoneService
          .addPerson({ id: `${persons.length + 1}`, name, number })
          .then(newPerson => setPersons(persons.concat(newPerson)))
          .then(() => true)
          .catch(error => {
            console.error(error);
            alert(`Failed to add person. check logs for error`)
            return false
          });
      }
    }

  }

  const handleDelete = (id) => {
    phoneService
      .deletePerson(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

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
        persons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App