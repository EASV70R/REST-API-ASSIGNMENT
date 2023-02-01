//Include/Require important modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Import the routes
const swaggerDefinition = YAML.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

const { verifyToken } = require('./validation');

const testRouter = require('./routes/test');
const catRouter = require('./routes/cat');
const userRouter = require('./routes/auth');

// Load environment variables
require("dotenv-flow").config();

// Parse incoming requests data
app.use(bodyParser.json());

app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Hello" });
});

// Connect to database
mongoose.connect(
    process.env.DBHOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).catch(error => console.log("Error connecting to database: ", error));

mongoose.connection.once("open", () => console.log("Connected to database"));

// Use the routes
app.use("/api/test", verifyToken, testRouter);
app.use("/api/cat", verifyToken, catRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});

module.exports = app;