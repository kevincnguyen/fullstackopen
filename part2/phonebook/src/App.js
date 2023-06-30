import { useEffect, useState } from 'react'
import personService from './services/PersonService'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Message from './components/Message'

const App = () => {
  const [persons, setPersons] = useState([]) ;
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    personService
      .getAll()
      .then(personList => {
        setPersons(personList); 
      })
  }, []);  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(newName)) {
      if(window.confirm(`${newName} is already added to the phonebook.\nReplace the old number with the new one?`)) {
        const person = persons.find(p => p.name === newName);
        const changedPerson = { ...person, number: newNumber}; 
        personService
          .update(person.id, changedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson));
            setMessage(`Updated ${newName}.`);
          })
          .catch(error => {
            setMessage(`Information of ${newName} has already been removed from the server.`);
            setSuccess(false);
          });
      }
    } else {
      const newEntry = {name: newName, number: newNumber}; 
      personService
        .create(newEntry)
        .then(newPerson => {
          setPersons(persons.concat(newPerson));
          setMessage(`Added ${newName}.`);
        })
        .catch(error => {
          // setMessage(`Information of ${newName} has already been removed from the server.`);
          setMessage(error.response.data.error); 
          setSuccess(false);
        });
    }
    setTimeout(() => {
      setMessage(null);
      setSuccess(true);
    }, 5000);
    setNewName('')
    setNewNumber('')
  }
  
  const handleDelete = (id, name) => {
    personService
      .remove(id)
      .then(() => {
        if (window.confirm(`Delete ${name}?`)) {
          setPersons(persons.filter(person => person.id !== id));
        } 
      }); 
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const peopleToShow = (filter === '')
    ? persons 
    : persons.filter(person => person.name.toUpperCase().startsWith(filter.toUpperCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} success={success} />
      <Filter filter={filter} handleFilter={handleFilter} />

      <h3>Add a new</h3>
      <PersonForm 
        handleSubmit={handleSubmit}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />

      <h3>Numbers</h3>
      <Persons peopleToShow={peopleToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App