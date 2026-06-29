import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

async function connectWithRetry(retries = 3, delay = 2000): Promise<PrismaClient> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log("Prisma connected");
      return prisma;
    } catch (err) {
      console.error(`Prisma connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Prisma connection failed after retries");
}

connectWithRetry();

export default prisma;
