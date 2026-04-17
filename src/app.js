const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(helmet());
app.use(morgan("dev"));

app.use(
    "/api-docs",
    (req, res, next) => {
        // Helmet blocks Swagger UI CSS/JS — disable CSP for this route only
        res.setHeader("Content-Security-Policy", "");
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server running 🚀",
    });
});

app.use("/api/v1/auth", authRoutes);

module.exports = app;