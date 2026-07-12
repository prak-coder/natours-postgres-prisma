require("dotenv").config({ path: "../../.env" }); // Adjust path to where your .env sits
const fs = require("fs");

const prisma = require(`../../utils/db`);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    // 1. Clean Tours
    const cleanedTours = tours.map((tour) => {
      const { _id, startDates, ...rest } = tour;
      return {
        ...rest,
        startDates: startDates ? startDates.map((date) => new Date(date)) : [],
      };
    });

    // 2. Clean Users: Safely extract fields and replace hyphens with underscores
    const cleanedUsers = users.map((user) => {
      const { _id, role, ...rest } = user;

      // Converts 'lead-guide' -> 'LEAD_GUIDE', 'guide' -> 'GUIDE', etc.
      const formattedRole = role
        ? role.toUpperCase().replace("-", "_")
        : "USER";

      return {
        ...rest,
        role: formattedRole,
      };
    });

    console.log("Starting batch import into PostgreSQL...");

    // 3. Batch Insert
    await prisma.tour.createMany({ data: cleanedTours });
    await prisma.user.createMany({ data: cleanedUsers });

    console.log("Data successfully imported to PostgreSQL!");
    process.exit(0);
  } catch (error) {
    console.error("Data not imported. Error details:");
    console.error(error);
    process.exit(1);
  }
};

const deleteData = async (req, res) => {
  try {
    await prisma.tour.deleteMany();
    await prisma.user.deleteMany();
    console.log("data deleted in DB");
  } catch (error) {
    console.log(error);
  }
};

// console.log(process.argv[2]);
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
