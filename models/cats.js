const mongoose = require('mongoose');

const schema = mongoose.Schema;

// Create a schema
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

// Export the model
module.exports = mongoose.model('cat', catSchema);