import DisplayCountry from "./DisplayCountry"
import DisplayMultipleCountries from "./DisplayMultipleCountries"

const DisplayContent = ({ countries }) => {
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
            <DisplayMultipleCountries
                countries={countries}
            />
        )
    }
}

export default DisplayContent