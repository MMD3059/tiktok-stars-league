import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import teamsRouter from "./routes/teams.js";
import playersRouter from "./routes/players.js";
import matchesRouter from "./routes/matches.js";
import standingsRouter from "./routes/standings.js";
import topScorersRouter from "./routes/topScorers.js";
import transfersRouter from "./routes/transfers.js";
import authRouter from "./routes/auth.js";
import prisma from "./prisma.js";
import { adminAuth } from "./middleware/adminAuth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3002", 10);

app.use(cors());
app.use(express.json());



// Multer config (memory storage — convert to base64 for DB persistence)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
app.use("/api/auth", authRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/players", playersRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/standings", standingsRouter);
app.use("/api/top-scorers", topScorersRouter);
app.use("/api/transfers", transfersRouter);

// Admin-only routes (write operations)
app.post("/api/admin/teams", adminAuth, async (req, res) => {
  const team = await prisma.team.create({ data: req.body });
  res.json(team);
});

app.put("/api/admin/teams/:id", adminAuth, async (req, res) => {
  const team = await prisma.team.update({ where: { id: +req.params.id }, data: req.body });
  res.json(team);
});

app.delete("/api/admin/teams/:id", adminAuth, async (req, res) => {
  await prisma.team.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/players", adminAuth, async (req, res) => {
  const player = await prisma.player.create({ data: req.body });
  res.json(player);
});

app.put("/api/admin/players/:id", adminAuth, async (req, res) => {
  const player = await prisma.player.update({ where: { id: +req.params.id }, data: req.body });
  res.json(player);
});

app.delete("/api/admin/players/:id", adminAuth, async (req, res) => {
  await prisma.player.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/matches", adminAuth, async (req, res) => {
  const match = await prisma.match.create({ data: req.body });
  res.json(match);
});

app.put("/api/admin/matches/:id", adminAuth, async (req, res) => {
  const match = await prisma.match.update({ where: { id: +req.params.id }, data: req.body });
  res.json(match);
});

app.delete("/api/admin/matches/:id", adminAuth, async (req, res) => {
  await prisma.match.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

app.post("/api/admin/transfers", adminAuth, async (req, res) => {
  const transfer = await prisma.transfer.create({ data: req.body });
  res.json(transfer);
});

app.delete("/api/admin/transfers/:id", adminAuth, async (req, res) => {
  await prisma.transfer.delete({ where: { id: +req.params.id } });
  res.json({ ok: true });
});

// File upload (base64 for DB persistence)
app.post("/api/admin/upload", adminAuth, upload.single("file"), (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const mime = req.file.mimetype;
  const b64 = req.file.buffer.toString("base64");
  res.json({ url: `data:${mime};base64,${b64}` });
});

// Manual standings override
app.put("/api/admin/standings/:teamId", adminAuth, async (req, res) => {
  const { points, won, drawn, lost, goalsFor, goalsAgainst } = req.body;
  const team = await prisma.team.update({
    where: { id: +req.params.teamId },
    data: {
      manualPoints: points ?? null,
      manualWon: won ?? null,
      manualDrawn: drawn ?? null,
      manualLost: lost ?? null,
      manualGoalsFor: goalsFor ?? null,
      manualGoalsAgainst: goalsAgainst ?? null,
    },
  });
  res.json(team);
});

// Serve client build (after API routes so they take priority)
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

// SPA fallback: serve index.html for any non-API request
const clientIndex = path.join(clientDist, "index.html");
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(clientIndex);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
