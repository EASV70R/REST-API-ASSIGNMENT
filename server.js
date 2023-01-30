const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const testRouter = require('./routes/test');
const userRouter = require('./routes/auth');

require("dotenv-flow").config();

app.use(bodyParser.json());

app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Hello" });
});

mongoose.connect(
    process.env.DBHOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).catch(error => console.log("Error connecting to database: ", error));

mongoose.connection.once("open", () => console.log("Connected to database"));

app.use("/api/test", testRouter);
app.use("/api/user", userRouter);


const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});

module.exports = app;