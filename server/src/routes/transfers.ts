import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const transfers = await prisma.transfer.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(transfers);
});

export default router;
