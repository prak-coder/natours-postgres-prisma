require("dotenv").config({ path: "../../.env" }); // Adjust path to where your .env sits
const fs = require("fs");

const prisma = require(`../../utils/db`);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"),
);

const importData = async (req, res) => {
  try {
    await prisma.tour.createMany({
      data: tours,
    });
    console.log("data imported to DB");
    process.exit();
  } catch (error) {
    console.log("data not imported", error.message);
    process.exit(1);
  }
};

const deleteData = async (req, res) => {
  try {
    await prisma.tour.deleteMany();
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
