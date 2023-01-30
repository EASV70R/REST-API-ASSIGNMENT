const router = require('express').Router();

// Import the test model
const test = require('../models/testschema');
const { verifyToken } = require('../validation');
// Create a test
router.post('/', verifyToken, (req, res) => {
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

// Read all tests
router.get('/', verifyToken, (req, res) => {
    test.find()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Read a test by id
router.get('/:id', (req, res) => {
    test.findById(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "Test not found with id " + req.params.id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Update a test by id
router.put('/:id', (req, res) => {
    test.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            age: req.body.age,
        }, { new: true })
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "Test not found with id " + req.params.id });
            } else {
                res.send({ message: "Test updated successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Delete a test by id
router.delete('/:id', (req, res) => {
    test.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "Test not found with id " + req.params.id });
            } else {
                res.send({ message: "Test deleted successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

module.exports = router;