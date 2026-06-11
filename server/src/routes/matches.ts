import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ week: "asc" }, { date: "asc" }, { time: "asc" }],
  });
  res.json(matches);
});

router.get("/:id", async (req, res) => {
  const match = await prisma.match.findUnique({
    where: { id: Number(req.params.id) },
    include: { homeTeam: true, awayTeam: true },
  });
  if (!match) { res.status(404).json({ error: "Match not found" }); return; }
  res.json(match);
});

export default router;
