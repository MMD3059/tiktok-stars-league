import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  const teams = await prisma.team.findMany({
    include: {
      homeMatches: { include: { awayTeam: true } },
      awayMatches: { include: { homeTeam: true } },
    },
  });

  const standings = teams.map((team) => {
    let played = 0, won = 0, drawn = 0, lost = 0;
    let goalsFor = 0, goalsAgainst = 0;
    let yellowCards = 0, redCards = 0;

    team.homeMatches.forEach((m) => {
      if (m.status === "played" && m.homeScore != null && m.awayScore != null) {
        played++;
        goalsFor += m.homeScore;
        goalsAgainst += m.awayScore;
        if (m.homeScore > m.awayScore) won++;
        else if (m.homeScore === m.awayScore) drawn++;
        else lost++;
      }
      yellowCards += m.homeYellowCards ?? 0;
      redCards += m.homeRedCards ?? 0;
    });

    team.awayMatches.forEach((m) => {
      if (m.status === "played" && m.homeScore != null && m.awayScore != null) {
        played++;
        goalsFor += m.awayScore;
        goalsAgainst += m.homeScore;
        if (m.awayScore > m.homeScore) won++;
        else if (m.awayScore === m.homeScore) drawn++;
        else lost++;
      }
      yellowCards += m.awayYellowCards ?? 0;
      redCards += m.awayRedCards ?? 0;
    });

    const base = {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      logo: team.logo,
      color: team.color,
      played,
      won,
      drawn,
      lost,
      goalsFor,
      goalsAgainst,
      goalDifference: goalsFor - goalsAgainst,
      points: won * 3 + drawn,
      yellowCards,
      redCards,
    };

    if (team.manualPoints != null) {
      return {
        ...base,
        points: team.manualPoints,
        won: team.manualWon ?? base.won,
        drawn: team.manualDrawn ?? base.drawn,
        lost: team.manualLost ?? base.lost,
        goalsFor: team.manualGoalsFor ?? base.goalsFor,
        goalsAgainst: team.manualGoalsAgainst ?? base.goalsAgainst,
        goalDifference: (team.manualGoalsFor ?? base.goalsFor) - (team.manualGoalsAgainst ?? base.goalsAgainst),
      };
    }

    return base;
  });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  res.json(standings);
});

export default router;
