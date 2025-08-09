import { useState } from "react"
import DisplayCountry from "./DisplayCountry"

const DisplayMultipleCountries = ({ countries }) => {

    const [selectedCountry, setSelectedCountry] = useState(null)

    const generateHandleClick = (country) => () => setSelectedCountry(country)

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <div
                style={{
                    flex: '1'
                }}
            >
                {countries.map(country => (
                    <div
                        key={country.cca2}
                    >
                        {country.name.common}  <button onClick={generateHandleClick(country)}>show</button>
                    </div>
                ))}
            </div>
            <div
                style={{
                    flex: '3'
                }}
            >
                {selectedCountry &&
                    <DisplayCountry
                        country={selectedCountry}
                    />}
            </div>
        </div>
    )
}

export default DisplayMultipleCountries