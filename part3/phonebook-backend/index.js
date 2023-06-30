require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('data', (req) => {
    return JSON.stringify(req.body);
});

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

// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ];

// const generateId = () => {
//   const id = Math.floor(Math.random() * 9999);
//   return id;
// }

// Routing:

// Sends # of people and date
app.get('/info', (request, response) => {
    Person.find({}).then(personList => {
        let numPeople = 0;
        personList.forEach(() => numPeople++);
        const current = new Date();
        const result = `<p>Phonebook has info for ${numPeople} people</p> 
                    <p>${current}</p>`;

        response.send(result);
    });
});

// Gets list of people
app.get('/api/persons', (request, response) => {
    Person.find({}).then(personList => {
        response.json(personList);
    });
});

// Gets information about person with id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result);
            } else {
                console.log('Person not found');
                response.statusMessage = 'Person not found';
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

// Deletes phonebook entry of person with id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            if (result) {
                console.log('Person successfully deleted');
                response.status(204).end();
            } else {
                console.log('Person not found');
                response.statusMessage = 'Person not found';
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

// Updates existing phonebook entry
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const requestPerson = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(
        request.params.id,
        requestPerson,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

// Adds new phonebook entry
app.post('/api/persons', (request, response, next) => {
    const body = request.body;

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({
            error: 'name or number is missing'
        });
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    });

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson);
        })
        .catch(error => next(error));
});

// Error Handling:

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }  else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});