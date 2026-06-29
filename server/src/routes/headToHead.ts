import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/:team1/:team2", async (req, res) => {
  try {
    const t1 = +req.params.team1;
    const t2 = +req.params.team2;
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeamId: t1, awayTeamId: t2 },
          { homeTeamId: t2, awayTeamId: t1 },
        ],
      },
      include: { homeTeam: true, awayTeam: true },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    const played = matches.filter((m) => m.status === "played");
    const t1Wins = played.filter(
      (m) =>
        (m.homeTeamId === t1 && m.homeScore != null && m.awayScore != null && m.homeScore > m.awayScore) ||
        (m.awayTeamId === t1 && m.awayScore != null && m.homeScore != null && m.awayScore > m.homeScore)
    ).length;
    const t2Wins = played.filter(
      (m) =>
        (m.homeTeamId === t2 && m.homeScore != null && m.awayScore != null && m.homeScore > m.awayScore) ||
        (m.awayTeamId === t2 && m.awayScore != null && m.homeScore != null && m.awayScore > m.homeScore)
    ).length;
    const draws = played.length - t1Wins - t2Wins;

    const t1Goals = played.reduce(
      (sum, m) =>
        sum +
        (m.homeTeamId === t1 ? m.homeScore || 0 : m.awayScore || 0),
      0
    );
    const t2Goals = played.reduce(
      (sum, m) =>
        sum +
        (m.homeTeamId === t2 ? m.homeScore || 0 : m.awayScore || 0),
      0
    );

    res.json({ matches, stats: { played: played.length, t1Wins, t2Wins, draws, t1Goals, t2Goals } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
