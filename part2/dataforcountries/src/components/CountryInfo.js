import React, {useEffect, useState} from 'react'; 
import axios from "axios";

const CountryInfo = ({country}) => {
    const [temp, setTemp] = useState(''); 
    const [wind, setWind] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        const api_key = process.env.REACT_APP_API_KEY; 
        axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&APPID=${api_key}`).then(response => {
            setTemp(response.data.main.temp - 273.15);
            setWind(response.data.wind.speed);
            setIcon(response.data.weather[0].icon);
        });
    }, []);

    const languages = Object.values(country.languages).map(language => <li key={language}>{language}</li>);  
    
    return (
        <div>
            <h1>{country.name.common}</h1>
            <div> 
                <p>Capital: {country.capital}</p>
                <p>Area: {country.area} </p>
            </div>
            <div>
                <h3>Languages:</h3>
                <ul>
                    {languages}
                </ul>
            </div>
            <div>
                <img src={country.flags.png} alt="flag" />
            </div>
            <div>
                <h3>Weather in {country.capital}:</h3>
                <p>Temperature: {temp} Celcius</p> 
                <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt='icon' />
                <p>Wind: {wind} m/s</p>
            </div>
        </div>
    );
}

export default CountryInfo; 