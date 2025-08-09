
import { useEffect, useState } from "react";
import countryService from "./services/countries"
import DisplayCountries from "./components/DisplayCountries"

const App = () => {

  const [filter, setFilter] = useState('');
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(data => setCountries(data))
  }, [])

  const countriesToShow = countries && filter
    ? countries.filter(country => country.name.common.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
    : null

  return (
    <div>
      find countries&nbsp;
      <input
        value={filter}
        onChange={event => setFilter(event.target.value)}
      />
      <DisplayCountries
        countries={countriesToShow}
      />
    </div>
  );
}

export default App
