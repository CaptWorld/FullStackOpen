import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const getWeatherReport = (lat, lon) => axios
    .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`)
    .then(response => response.data)

export default { getWeatherReport }