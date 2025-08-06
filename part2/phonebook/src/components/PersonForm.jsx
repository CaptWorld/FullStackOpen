import { useState } from "react"

const PersonForm = ({ persons, setPersons }) => {

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const handleNewPersonCreation = (event) => {
        event.preventDefault()
        if (persons.findIndex(person => person.name === newName) !== -1) {
            window.alert(`${newName} is already added to phonebook`)
        } else if (persons.findIndex(person => person.number === newNumber) !== -1) {
            window.alert(`${newNumber} is already added to phonebook`)
        } else {
            setPersons(persons.concat({ name: newName, number: newNumber }))
            setNewName('')
            setNewNumber('')
        }
    }

    return (
        <form onSubmit={handleNewPersonCreation}>
            <div>
                name: <input value={newName} onChange={(event) => setNewName(event.target.value)}
                />
            </div>
            <div>
                number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm