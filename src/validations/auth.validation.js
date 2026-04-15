const { z } = require("zod");

const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const updateSchema = z.object({
    email: z.string().email(),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateSchema,
};