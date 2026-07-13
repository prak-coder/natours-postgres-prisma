const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const slugify = require("slugify");

// 1. Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Instantiate the base client with the Prisma 7 adapter
const basePrisma = new PrismaClient({ adapter });

// 3. Extend the client with custom business logic
const prisma = basePrisma.$extends({
  // VIRTUAL FIELDS
  result: {
    tour: {
      durationInWeeks: {
        needs: { duration: true },
        compute(tour) {
          return tour.duration ? tour.duration / 7 : 0;
        },
      },
    },
  },
  // HOOKS (PRE/POST LOGIC)
  query: {
    tour: {
      async create({ args, query }) {
        if (args.data.name) {
          args.data.slug = slugify(args.data.name, { lower: true });
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.name) {
          args.data.slug = slugify(args.data.name, { lower: true });
        }
        return query(args);
      },
    },
  },
});

// 4. Test the database connection using the base client
basePrisma
  .$connect()
  .then(() => {
    console.log("🐘 PostgreSQL database connection successful via Prisma!");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

// 5. Export the extended client instance
module.exports = prisma;
