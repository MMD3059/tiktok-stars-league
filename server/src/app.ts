import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import teamsRouter from "./routes/teams.js";
import playersRouter from "./routes/players.js";
import matchesRouter from "./routes/matches.js";
import standingsRouter from "./routes/standings.js";
import topScorersRouter from "./routes/topScorers.js";
import transfersRouter from "./routes/transfers.js";
import authRouter from "./routes/auth.js";
import headToHeadRouter from "./routes/headToHead.js";
import prisma from "./prisma.js";
import { adminAuth } from "./middleware/adminAuth.js";
import { generalLimiter, authLimiter, adminLimiter } from "./middleware/rateLimiter.js";
import { sanitize, sanitizeObject } from "./utils/sanitize.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(generalLimiter);

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/players", playersRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/standings", standingsRouter);
app.use("/api/top-scorers", topScorersRouter);
app.use("/api/transfers", transfersRouter);
app.use("/api/head-to-head", headToHeadRouter);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];

// ===== HEALTH CHECK (keep DB alive) =====
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch {
    res.status(503).json({ status: "error", message: "Database unavailable" });
  }
});

// ===== ADMINISTRATOR ROUTES (all protected by adminAuth + adminLimiter) =====
app.post("/api/admin/teams", adminAuth, adminLimiter, async (req, res) => {
  const data = sanitizeObject(req.body);
  const team = await prisma.team.create({ data });
  res.json(team);
});

app.put("/api/admin/teams/:id", adminAuth, adminLimiter, async (req, res) => {
  const data = sanitizeObject(req.body);
  const team = await prisma.team.update({ where: { id: +req.params.id }, data });
  res.json(team);
});

app.delete("/api/admin/teams/:id", adminAuth, adminLimiter, async (req, res) => {
  await prisma.team.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/players", adminAuth, adminLimiter, async (req, res) => {
  try {
    let { name, teamId } = req.body;
    if (!name || !teamId) {
      res.status(400).json({ error: "Missing name or teamId" });
      return;
    }
    name = sanitize(String(name)).trim();
    teamId = Number(teamId);
    if (!teamId || isNaN(teamId)) {
      res.status(400).json({ error: "Invalid teamId" });
      return;
    }
    const existing = await prisma.player.findFirst({
      where: { name, teamId },
    });
    if (existing) {
      const player = await prisma.player.update({ where: { id: existing.id }, data: { ...sanitizeObject(req.body), name, teamId } });
      res.json(player);
      return;
    }
    const player = await prisma.player.create({ data: { ...sanitizeObject(req.body), name, teamId } });
    res.json(player);
  } catch (err: any) {
    console.error("POST /api/admin/players error:", err?.message || err);
    res.status(500).json({ error: err?.message || "Internal error" });
  }
});

app.put("/api/admin/players/:id", adminAuth, adminLimiter, async (req, res) => {
  const data = sanitizeObject(req.body);
  if (data.name) data.name = String(data.name).trim();
  if (data.teamId) data.teamId = Number(data.teamId);
  const player = await prisma.player.update({ where: { id: +req.params.id }, data });
  res.json(player);
});

app.delete("/api/admin/players/:id", adminAuth, adminLimiter, async (req, res) => {
  await prisma.player.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/matches", adminAuth, adminLimiter, async (req, res) => {
  try {
    const data = sanitizeObject(req.body);
    if (data.homeTeamId) data.homeTeamId = Number(data.homeTeamId);
    if (data.awayTeamId) data.awayTeamId = Number(data.awayTeamId);
    if (data.week) data.week = Number(data.week);
    if (data.homeScore != null) data.homeScore = Number(data.homeScore);
    if (data.awayScore != null) data.awayScore = Number(data.awayScore);
    const match = await prisma.match.create({ data });
    res.json(match);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.put("/api/admin/matches/:id", adminAuth, adminLimiter, async (req, res) => {
  const data = sanitizeObject(req.body);
  if (data.homeTeamId) data.homeTeamId = Number(data.homeTeamId);
  if (data.awayTeamId) data.awayTeamId = Number(data.awayTeamId);
  if (data.week) data.week = Number(data.week);
  if (data.homeScore != null) data.homeScore = Number(data.homeScore);
  if (data.awayScore != null) data.awayScore = Number(data.awayScore);
  const match = await prisma.match.update({ where: { id: +req.params.id }, data });
  res.json(match);
});

app.delete("/api/admin/matches/:id", adminAuth, adminLimiter, async (req, res) => {
  await prisma.match.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/transfers", adminAuth, adminLimiter, async (req, res) => {
  const data = sanitizeObject(req.body);
  const transfer = await prisma.transfer.create({ data });
  res.json(transfer);
});

app.delete("/api/admin/transfers/:id", adminAuth, adminLimiter, async (req, res) => {
  await prisma.transfer.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/upload", adminAuth, adminLimiter, upload.single("file"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    res.status(400).json({ error: `Invalid file type: ${req.file.mimetype}` });
    return;
  }
  const mime = req.file.mimetype;
  const b64 = req.file.buffer.toString("base64");
  res.json({ url: `data:${mime};base64,${b64}` });
});

app.put("/api/admin/standings/:teamId", adminAuth, adminLimiter, async (req, res) => {
  let { points, won, drawn, lost, goalsFor, goalsAgainst } = req.body;
  points = points != null ? Number(points) : null;
  won = won != null ? Number(won) : null;
  drawn = drawn != null ? Number(drawn) : null;
  lost = lost != null ? Number(lost) : null;
  goalsFor = goalsFor != null ? Number(goalsFor) : null;
  goalsAgainst = goalsAgainst != null ? Number(goalsAgainst) : null;
  const team = await prisma.team.update({
    where: { id: +req.params.teamId },
    data: {
      manualPoints: points,
      manualWon: won,
      manualDrawn: drawn,
      manualLost: lost,
      manualGoalsFor: goalsFor,
      manualGoalsAgainst: goalsAgainst,
    },
  });
  res.json(team);
});

app.post("/api/admin/distribute-value/:teamId", adminAuth, adminLimiter, async (req, res) => {
  const teamId = +req.params.teamId;
  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { players: true } });
  if (!team || !team.value) { res.status(400).json({ error: "Team has no value set" }); return; }
  const nonCaptains = team.players.filter(p => !p.isCaptain);
  if (nonCaptains.length === 0) { res.status(400).json({ error: "No non-captain players" }); return; }
  const share = Math.floor(team.value / nonCaptains.length);
  for (const p of nonCaptains) {
    await prisma.player.update({ where: { id: p.id }, data: { price: share } });
  }
  res.json({ ok: true, share, count: nonCaptains.length });
});

export default app;
