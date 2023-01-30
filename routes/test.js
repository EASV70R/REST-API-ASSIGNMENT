const router = require('express').Router();

// Import the test model
let test = require('../models/testschema');

// Read all tests
router.route('/').get((req, res) => {
    test.find()
        .then(data => res.json(data))
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Create a test
router.post('/', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;

    const newTest = new test({
        name,
        age,
    });

    test.insertMany(newTest)
        .then(newTest => { res.send(newTest); })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});


module.exports = router;