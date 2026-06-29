import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { adminAuth, type AuthRequest } from "../middleware/adminAuth.js";

const router = Router();
const SECRET = process.env.JWT_SECRET || "fallback-secret";

async function ensureAdmin() {
  const count = await prisma.admin.count();
  if (count === 0) {
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin";
    const hash = await bcrypt.hash(password, 10);
    await prisma.admin.create({ data: { username, password: hash } });
    console.log(`Admin auto-seeded: ${username}`);
  }
}

router.post("/login", async (req, res) => {
  try {
    await ensureAdmin();
    const { username, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ username, id: admin.id }, SECRET, { expiresIn: "24h" });
    res.json({ token, username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/change-password", adminAuth, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Missing currentPassword or newPassword" });
      return;
    }
    if (newPassword.length < 4) {
      res.status(400).json({ error: "New password must be at least 4 characters" });
      return;
    }
    const admin = await prisma.admin.findUnique({ where: { username: req.admin!.username } });
    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hash } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
