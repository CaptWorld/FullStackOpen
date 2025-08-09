import DisplayCountry from "./DisplayCountry"

const DisplayCountries = ({ countries }) => {
    if (!countries) {
        return null
    }

    if (countries.length === 1) {
        return (
            <DisplayCountry
                country={countries[0]}
            />
        )
    } else if (countries.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else {
        return (
            <div>
                {countries.map(country => (
                    <div
                        key={country.cca2}
                    >
                        {country.name.common}
                    </div>
                ))}
            </div>
        )
    }
}

export default DisplayCountries