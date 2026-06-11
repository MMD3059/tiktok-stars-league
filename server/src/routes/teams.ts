import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const teams = await prisma.team.findMany({ include: { players: true } });
  res.json(teams);
});

router.get("/:id", async (req, res) => {
  const team = await prisma.team.findUnique({
    where: { id: Number(req.params.id) },
    include: { players: true },
  });
  if (!team) { res.status(404).json({ error: "Team not found" }); return; }
  res.json(team);
});

export default router;
