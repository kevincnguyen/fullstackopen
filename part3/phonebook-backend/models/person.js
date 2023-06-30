const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    }); 

// Define schema 
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name required']
    }, 
    number: {
        type: String,
        validate: {
            validator: function(val) {
                return /^\d{2,3}-\d{6,}$/.test(val);   
            }, 
            // length of 8 or more
            // be formed of two parts that are separated by -, 
            // the first part has two or three numbers 
            // - 
            // the second part also consists of numbers 
            message: 'Invalid phone number'
        },
        required: [true, 'Number required']
    }
});

// Reformat return object
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
}); 

// Define model 
module.exports = mongoose.model('Person', personSchema);