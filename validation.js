const joi = require('joi');
const jwt = require('jsonwebtoken');

const registerValidation = (data) => {
    const schema = joi.object({
        username: joi.string().min(6).max(50).required(),
        email: joi.string().min(6).max(50).required().email(),
        password: joi.string().min(6).max(50).required(),
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(6).max(50).required().email(),
        password: joi.string().min(6).max(50).required(),
    });
    return schema.validate(data);
}

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.verifyToken = verifyToken;