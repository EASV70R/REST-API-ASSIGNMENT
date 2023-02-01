const mongoose = require('mongoose');

const schema = mongoose.Schema;

const catSchema = new schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    breed: {
        type: String,
    },
    color: {
        type: String,
    }
});

module.exports = mongoose.model('cat', catSchema);