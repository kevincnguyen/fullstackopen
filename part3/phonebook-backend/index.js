const express = require("express"); 
const morgan = require('morgan'); 
const cors = require('cors');
const app = express(); 

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body); 
});  

app.use(express.json()); 
app.use(cors()); 
app.use(morgan((tokens, req, res) => {
  let result = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms', 
  ].join(' ');

  if (tokens.method(req, res) === 'POST') {
    result += ' ' + tokens.data(req, res); 
  }

  return result; 
})); 
app.use(express.static('build')); 

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

// Sends # of people and date
app.get('/info', (request, response) => {
  const numPeople = persons.length; 
  const current = new Date();
  const result = `<p>Phonebook has info for ${numPeople} people</p> 
                  <p>${current}</p>`  
  response.send(result);
});  

// Sends persons list
app.get('/api/persons', (request, response) => {
  response.json(persons);
}); 

// Sends information about person with id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else { 
    response.statusMessage = "Person not found";
    response.status(404).end();
  }
}); 

// Deletes phonebook entry of person with id
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
}); 

const generateId = () => {
  const id = Math.floor(Math.random() * 9999);
  return id;
}

// Adds new phonebook entry
app.post('/api/persons', (request, response) => {
  const body = request.body; 
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    }); 
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name: body.name, 
    number: body.number 
  };

  persons = persons.concat(person); 
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});