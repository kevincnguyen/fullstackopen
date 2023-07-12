const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: [3, 'username must at least be 3 characters'],
        required: [true, 'username required'],
        unique: true
    },
    name: String,
    passwordHash: {
        type: String,
        minLength: [3, 'password must at least be 3 characters'],
        required: [true, 'password required']
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

userSchema.plugin(uniqueValidator, { message: 'username already exists' });

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    }
});

module.exports = mongoose.model('User', userSchema);