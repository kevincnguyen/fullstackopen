import Person from './Person'
import DeleteButton from './DeleteButton'

const Persons = ({peopleToShow, handleDelete}) => {
    return (
        <div>
        {peopleToShow.map(person => {
                return(
                    <div key={person.name}>
                        <Person name={person.name} number={person.number} />
                        <DeleteButton name={person.name} id={person.id} handleDelete={handleDelete} />
                    </div> 
                )  
            })}
        </div>
    )
}

export default Persons 