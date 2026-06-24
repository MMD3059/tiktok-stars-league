import express from "express";
import app from "./app.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "3002", 10);

const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

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
