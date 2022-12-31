import CountryList from './CountryList'; 
import CountryInfo from './CountryInfo'; 

const CountryDisplay = ({countries, filter}) => {
    if (filter === '') {
        return null; 
    } 

    const f = countries.filter(country => country.name.common.toUpperCase().includes(filter.toUpperCase()));
    const countryToDisplay = 
            (f.length > 10) ? <div>Too many matches, specify another filter</div>
            : (f.length < 10 && f.length > 1) ? <CountryList countries={f} />
            : (f.length === 1) ? <CountryInfo country={f[0]} />
            : <div>No results found</div>;
    
    return (
        <>{countryToDisplay}</>
    );
}

export default CountryDisplay; 