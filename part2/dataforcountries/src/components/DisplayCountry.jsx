import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const DisplayCountry = ({ country }) => {
    const [weatherReport, setWeatherReport] = useState(null)

    useEffect(() => {
        if (country.capitalInfo.latlng) {
            weatherService
                .getWeatherReport(...country.capitalInfo.latlng)
                .then(data => setWeatherReport(data))
        }
    }, [country])

    return (
        <div>
            <h1>
                {country.name.common}
            </h1>
            <div>
                Capital {country.capital ? country.capital[0] : <b>Doesn't exist</b>}
            </div>
            <div>
                Area {country.area}
            </div>
            <h2>
                Languages
            </h2>
            <ul>
                {country.languages && Object.entries(country.languages).map(([code, lang]) => (
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
            {weatherReport &&
                <div>
                    <h2>Weather in {country.capital[0]}</h2>
                    <div>Temperature {weatherReport.current.temp} Celsius</div>
                    <img
                        src={`https://openweathermap.org/img/wn/${weatherReport.current.weather[0].icon}@2x.png`}
                        alt={weatherReport.current.weather[0].description}
                    />
                    <div>Wind {weatherReport.current.wind_speed} m/s</div>
                </div>
            }
        </div>
    )
}

export default DisplayCountry