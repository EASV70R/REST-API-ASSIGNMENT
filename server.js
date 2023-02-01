const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDefinition = YAML.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const { verifyToken } = require('./validation');

const testRouter = require('./routes/test');
const catRouter = require('./routes/cat');
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

app.use("/api/test", verifyToken, testRouter);
app.use("/api/cat", verifyToken, catRouter);
app.use("/api/user", userRouter);


const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});

module.exports = app;