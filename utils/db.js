// utils/db.js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Instantiate the client with the Prisma 7 adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
