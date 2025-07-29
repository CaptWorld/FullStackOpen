const Persons = ({ filter, persons }) => {
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
    return (
        <div>
            {filteredPersons.map(person =>
                <div
                    key={person.name}
                >
                    {person.name} {person.phone}
                </div>
            )}
        </div>
    );
}

export default Persons