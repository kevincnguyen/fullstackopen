const SearchBar = ({value, handleChange}) => {
    return (
      <label>Find Countries: 
        <input type='text' value={value} onChange={handleChange} />
      </label>
    );
}

export default SearchBar; 