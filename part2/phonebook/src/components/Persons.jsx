const Persons = ({ persons, handleDelete }) => {
    const generateHandleClick = (person) => () => {
        if (confirm(`Delete ${person.name} ?`)) {
            handleDelete(person.id);
        }
    }
    return (
        <div>
            {persons.map(person =>
                <div
                    key={person.name}
                >
                    {person.name} {person.number}&nbsp;&nbsp;
                    <button onClick={generateHandleClick(person)}>
                        delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Persons