require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();  // ✅ no adapter here

module.exports = prisma;