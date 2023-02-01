const router = require('express').Router();

// Import the test model
const user = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

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
module.exports = router;