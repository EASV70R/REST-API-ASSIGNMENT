const router = require('express').Router();

// Import the cat model
const cat = require('../models/cats');

// Create a cat
router.post('/', (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    const gender = req.body.gender;
    const breed = req.body.breed;
    const color = req.body.color;

    const newcat = new cat({
        name,
        age,
        gender,
        breed,
        color,
    });

    cat.insertMany(newcat)
        .then(newcat => { res.send(newcat); })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Read all cats
router.get('/', (req, res) => {
    cat.find()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Read a cat by id
router.get('/:id', (req, res) => {
    cat.findById(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "cat not found with id " + req.params.id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Update a cat by id
router.put('/:id', (req, res) => {
    cat.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            breed: req.body.breed,
            color: req.body.color,
        }, { new: true })
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "cat not found with id " + req.params.id });
            } else {
                res.send({ message: "cat updated successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Delete a cat by id
router.delete('/:id', (req, res) => {
    cat.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "cat not found with id " + req.params.id });
            } else {
                res.send({ message: "cat deleted successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

module.exports = router;