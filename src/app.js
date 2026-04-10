const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server running 🚀",
    });
});

app.use("/api/v1/auth", authRoutes);

module.exports = app;