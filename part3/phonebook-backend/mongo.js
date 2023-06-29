const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Give password as argument.');
    process.exit(1);
}

if (process.argv.length === 4 || process.argv.length > 5) {
    console.log('Unable to process request. Invalid number of arguments.');
    process.exit(1);
}

// Establish connection to database
const password = process.argv[2]; 
const url = `mongodb+srv://kevincuunguyen:${password}@cluster0.fnyge8n.mongodb.net/phonebook?retryWrites=true&w=majority`; 

mongoose.set('strictQuery',false);
mongoose.connect(url);

// Define schema 
const personSchema = mongoose.Schema({
    name: String, 
    number: String
});

// Define model 
const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        persons.forEach(p => {
            console.log(`${p.name} ${p.number}`); 
        });
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const name = process.argv[3]; 
    const number = process.argv[4]; 

    const entry = new Person({
        name: name,
        number: number
    });

    entry.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`); 
        mongoose.connection.close();
    });
}