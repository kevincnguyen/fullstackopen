import React, {useState} from "react";
import CountryInfo from "./CountryInfo";

const CountryToggle = ({country}) => {
    const [show, setShow] = useState(false); 

    const handleClick = () => {
        setShow(!show);
    }

    if (show) {
        return (
            <>
                <button onClick={handleClick}>Hide</button>
                <CountryInfo country={country} />
                <br />
            </>
        );
    } else {
        return (
            <>
                <button onClick={handleClick}>Show</button>
                <br />
            </>
        );
    }
}

export default CountryToggle; 