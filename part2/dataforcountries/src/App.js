import React, { useEffect, useState } from "react";
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CountryDisplay from './components/CountryDisplay';

const App = () => {
  const [search, setSearch] = useState(''); 
  const [countries, setCountries] = useState([]); 

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleNewSearch = (event) => {
    setSearch(event.target.value); 
  }

  return (
    <div>
      <SearchBar value={search} handleChange={handleNewSearch} />
      <CountryDisplay countries={countries} filter={search} />
    </div>
  );
}

export default App; 
