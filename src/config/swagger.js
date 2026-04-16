const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Infra Auth Cache Service API",
            version: "1.0.0",
            description: "Auth + RBAC + Redis + Rate Limiting Backend",
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js"], // 🔥 important
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;