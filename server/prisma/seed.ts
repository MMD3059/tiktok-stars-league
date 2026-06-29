import bcrypt from "bcryptjs";
import prisma from "../src/prisma.js";

async function main() {
  const existing = await prisma.admin.findFirst();
  if (existing) {
    console.log("Admin already exists, skipping seed");
    return;
  }
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin";
  const hash = await bcrypt.hash(password, 10);
  await prisma.admin.create({ data: { username, password: hash } });
  console.log(`Admin seeded: ${username}`);
}

main()
  .catch((e) => console.error("Seed error:", e))
  .finally(() => prisma.$disconnect());
