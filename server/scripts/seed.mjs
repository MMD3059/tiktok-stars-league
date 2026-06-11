import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.transfer.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  console.log("All old data deleted.");

  const team = await prisma.team.create({
    data: {
      name: "The Salamanca",
      shortName: "Salamanca",
      logo: "/placeholder-team.svg",
      color: "#8B0000",
    },
  });
  console.log("Team created:", team.id, team.name);

  const positions = ["GK", "DEF", "MID", "FW"];
  const starters = [
    { name: "كاريكا", isCaptain: true },
    { name: "يزن العراب", isCaptain: false },
    { name: "مستر اكس", isCaptain: false },
    { name: "سلوم", isCaptain: false },
  ];
  const subs = [
    { name: "كرار", isCaptain: false },
    { name: "احمد الفيلسوف", isCaptain: false },
  ];

  for (const s of starters) {
    await prisma.player.create({
      data: {
        name: s.name,
        position: positions[Math.floor(Math.random() * positions.length)],
        isCaptain: s.isCaptain,
        isSubstitute: false,
        goalsScored: 0,
        teamId: team.id,
      },
    });
  }

  for (const s of subs) {
    await prisma.player.create({
      data: {
        name: s.name,
        position: positions[Math.floor(Math.random() * positions.length)],
        isCaptain: s.isCaptain,
        isSubstitute: true,
        goalsScored: 0,
        teamId: team.id,
      },
    });
  }
  console.log("Players created.");

  const players = await prisma.player.findMany({ where: { teamId: team.id } });
  for (const p of players) {
    console.log(`  - ${p.name} (${p.position}) ${p.isCaptain ? "C" : ""} ${p.isSubstitute ? "SUB" : "START"}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
