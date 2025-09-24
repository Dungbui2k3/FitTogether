const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
    res.send({ message: "Welcome to Fit Together" });
});
app.use("/users", userRoutes);

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
