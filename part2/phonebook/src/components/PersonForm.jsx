import { useState } from "react"

const PersonForm = ({ setNewPerson }) => {

    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault()
        setNewPerson(newName, newNumber).then(isCreated => {
            if (isCreated) {
                setNewName('')
                setNewNumber('')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
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