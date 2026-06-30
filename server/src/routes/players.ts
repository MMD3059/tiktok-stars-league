import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const players = await prisma.player.findMany({ include: { team: true } });
  res.json(players);
});

router.get("/search", async (_req, res) => {
  const players = await prisma.player.findMany({
    select: { id: true, name: true, position: true, goalsScored: true, teamId: true, imageUrl: true },
  });
  res.json(players);
});

router.get("/:id", async (req, res) => {
  const player = await prisma.player.findUnique({
    where: { id: Number(req.params.id) },
    include: { team: true },
  });
  if (!player) { res.status(404).json({ error: "Player not found" }); return; }
  res.json(player);
});

export default router;
