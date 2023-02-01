const router = require('express').Router();

// Import the test model
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation, verifyToken } = require('../validation');

router.post("/register", async(req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await user.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).json({ error: "Email already exist!" })

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const newUser = new user({
        username: req.body.username,
        email: req.body.email,
        password: passwordHash
    });

    try {
        const savedUser = await newUser.save();
        res.json({ error: null, data: savedUser._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/login", async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
        email = undefined,
            username = undefined,
            password = undefined
    } = req.body;

    if ((!!email && !!username) || (!email && !username)) {
        return res.status(400).send("Provide Email or Username to login");
    }

    if (!password) {
        return res.status(400).send("Password is required");
    }

    const getUser = await user.findOne(email ? { email } : { username });
    if (!getUser) return res.status(400).json({ error: "Username or Email is wrong" })

    const validPass = await bcrypt.compare(password, getUser.password);
    if (!validPass) return res.status(400).json({ error: "Password is wrong" })

    const token = jwt.sign({
            username: getUser.username,
            id: getUser._id
        },
        process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return res.header('auth-token', token).json({
        error: null,
        data: { token }
    });

    //return res.status(200).json({ msg: "Logged in" });
});

// Read all users
router.get('/', verifyToken, (req, res) => {
    user.find()
        .then(data => { res.send(data); })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Read a user by id
router.get('/:id', verifyToken, (req, res) => {
    user.findById(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "user not found with id " + req.params.id });
            } else {
                res.send(data);
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Update a user by id
router.put('/:id', verifyToken, async(req, res) => {

    const {
        email = undefined,
            username = undefined,
            password = undefined
    } = req.body;

    /*const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);*/

    const emailExist = await user.findOne({ email: req.body.email });

    if (emailExist) return res.status(400).json({ error: "Email already exist!" })

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user.findByIdAndUpdate(req.params.id, {
            email,
            username,
            passwordHash
        }, { new: true })
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "user not found with id " + req.params.id });
            } else {
                res.send({ message: "user updated successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

// Delete a user by id
router.delete('/:id', verifyToken, (req, res) => {
    user.findByIdAndDelete(req.params.id)
        .then(data => {
            if (!data) {
                res.status(500).send({ message: "user not found with id " + req.params.id });
            } else {
                res.send({ message: "user deleted successfully." });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message })
        });
});

module.exports = router;