// user.repository.js
const prisma = require("../config/prisma");

const createUser = async (data) => {
    return prisma.user.create({
        data,
    });
};

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

module.exports = {
    createUser,
    findUserByEmail,
};