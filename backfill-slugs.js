// 1. MUST BE AT THE TOP to load environment variables first!
require("dotenv").config();

// 2. Import your extended Prisma client instance
const prisma = require("./utils/db");

async function backfillSlugs() {
  console.log("🔄 Starting slug backfill for existing tours...");

  try {
    const tours = await prisma.tour.findMany();
    console.log(`Found ${tours.length} tours to process.`);

    for (const tour of tours) {
      if (tour.name) {
        await prisma.tour.update({
          where: { id: tour.id },
          data: { name: tour.name },
        });
        console.log(`✔ Updated slug for: "${tour.name}"`);
      }
    }

    console.log("🎉 All existing tour slugs backfilled successfully!");
  } catch (error) {
    console.error("❌ Backfill failed:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

backfillSlugs();
