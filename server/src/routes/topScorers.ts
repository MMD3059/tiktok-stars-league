import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const players = await prisma.player.findMany({
    where: { goalsScored: { gt: 0 } },
    include: { team: true },
    orderBy: { goalsScored: "desc" },
  });
  res.json(players);
});

export default router;
