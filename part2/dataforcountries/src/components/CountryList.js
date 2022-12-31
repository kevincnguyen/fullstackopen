import CountryToggle from "./CountryToggle";

const CountryList = ({countries}) => {
    return (
        <div>
            {countries.map(country => 
                <label key={country.name.common}>
                    {country.name.common}
                    <CountryToggle country={country} />
                </label>)}
        </div>
    ); 
}

export default CountryList; 