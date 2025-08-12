import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to clear the `Class` table...");
  const { count } = await prisma.class.deleteMany({});
  console.log(`Successfully deleted ${count} classes.`);
}

main()
  .catch((e) => {
    console.error("An error occurred while clearing the table:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Process finished.");
  });
