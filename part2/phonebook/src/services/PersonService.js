import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'; 

// Gets all the people from the URL
const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

// Adds a new entry to the list of numbers
const create = newEntry => {
    const request = axios.post(baseUrl, newEntry);
    return request.then(response => response.data);
}

const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data); 
}

const update = (id, newEntry) => {
    const request = axios.put(`${baseUrl}/${id}`, newEntry); 
    return request.then(response => response.data);
}

const data = {getAll, create, remove, update}; 

export default data;