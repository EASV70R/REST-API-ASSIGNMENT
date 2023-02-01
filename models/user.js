const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userScheme = new schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('user', userScheme);