const Filter = ({filter, handleFilter}) => {
    return (
      <div>
        filter shown with: <input type='text' value={filter} onChange={handleFilter} />
      </div>
    )
}

export default Filter