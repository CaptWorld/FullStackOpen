const DisplayCountry = ({ country }) => {
    return (
        <div>
            <h1>
                {country.name.common}
            </h1>
            <div>
                Capital {country.capital.join(',')}
            </div>
            <div>
                Area {country.area}
            </div>
            <h2>
                Languages
            </h2>
            <ul>
                {Object.entries(country.languages).map(([code, lang]) => (
                    <li
                        key={code}
                    >
                        {lang}
                    </li>
                ))}
            </ul>
            <img
                src={country.flags.png}
                alt={country.flags.lat}
            />
        </div>
    )
}

export default DisplayCountry