const mongoose = require('mongoose');

const schema = mongoose.Schema;

const testSchema = new schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    }
});

module.exports = mongoose.model('test', testSchema);