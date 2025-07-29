import { useState } from "react"

const PersonForm = ({ persons, setPersons }) => {

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
        <form onSubmit={handleNewPersonCreation}>
            <div>
                name: <input value={newName} onChange={(event) => setNewName(event.target.value)}
                />
            </div>
            <div>
                number: <input value={newPhone} onChange={(event) => setNewPhone(event.target.value)}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm