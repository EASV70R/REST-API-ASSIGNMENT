const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

require("dotenv-flow").config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});

module.exports = app;