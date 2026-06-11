import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teams = [
  { name: "نجوم الحارة", shortName: "نجوم", logo: "/badges/team-1.svg", color: "#2563eb" },
  { name: "أسود الرمال", shortName: "أسود", logo: "/badges/team-2.svg", color: "#dc2626" },
  { name: "نسور القمة", shortName: "نسور", logo: "/badges/team-3.svg", color: "#d97706" },
  { name: "فرسان الليل", shortName: "فرسان", logo: "/badges/team-4.svg", color: "#7c3aed" },
  { name: "ذئاب الصحراء", shortName: "ذئاب", logo: "/badges/team-5.svg", color: "#059669" },
  { name: "صقور الشمال", shortName: "صقور", logo: "/badges/team-6.svg", color: "#0891b2" },
  { name: "أبطال الموج", shortName: "أبطال", logo: "/badges/team-7.svg", color: "#2563eb" },
  { name: "حراس المجد", shortName: "حراس", logo: "/badges/team-8.svg", color: "#9333ea" },
  { name: "سيوف العدالة", shortName: "سيوف", logo: "/badges/team-9.svg", color: "#15803d" },
  { name: "شموس الأصيل", shortName: "شموس", logo: "/badges/team-10.svg", color: "#b45309" },
];

const playerNames: Record<string, string[]> = {
  "نجوم الحارة": ["يزن عمار", "وسيم شرف", "رامي ديب", "معتز عباس", "خالد محسن", "قتيبة نصر"],
  "أسود الرمال": ["حازم عيد", "باسل كرم", "جابر سليمان", "موسى هلال", "إياد فهد", "لؤي صباح"],
  "نسور القمة": ["عاصم بدر", "هاني نور", "رياض قدور", "سليم عودة", "بهاء شهاب", "جلال مراد"],
  "فرسان الليل": ["بسام رعد", "مهند زيد", "غسان لطفي", "فادي شكري", "أكرم فوزي", "وديع ياسين"],
  "ذئاب الصحراء": ["تامر سيف", "نادر غالي", "حسام داوود", "رائد جابر", "مازن خليل", "أيمن رشيد"],
  "صقور الشمال": ["فارس عادل", "وليد توفيق", "زياد مروان", "ناجي عصام", "أديب سامر", "عدنان لؤي"],
  "أبطال الموج": ["سهيل جاد", "بشرى وسيم", "كميل رشيد", "داني سعيد", "جود نبيل", "سامر هاشم"],
  "حراس المجد": ["أمين هشام", "بطرس جاد", "جريس منصور", "حبيب فرح", "داوود إلياس", "زكريا نوح"],
  "سيوف العدالة": ["عبادة حاتم", "فخر الدين عامر", "كمال بدران", "مؤمن سامي", "نجيب توفيق", "هشام فؤاد"],
  "شموس الأصيل": ["إبراهيم شادي", "جميل مرسي", "خليل إياد", "زين ياسر", "شريف جابر", "صالح هاني"],
};

const positions = ["GK", "DEF", "LW", "RW", "MID", "SUB"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomScore() {
  return Math.floor(Math.random() * 5);
}

async function seed() {
  console.log("Seeding database...");

  for (const t of teams) {
    await prisma.team.create({
      data: {
        name: t.name,
        shortName: t.shortName,
        logo: t.logo,
        color: t.color,
      },
    });
  }

  const dbTeams = await prisma.team.findMany();

  for (const team of dbTeams) {
    const names = playerNames[team.name] || [];
    const shuffledPositions = shuffle(positions);

    for (let i = 0; i < names.length; i++) {
      const pos = shuffledPositions[i] || positions[i];
      const isSub = pos === "SUB";
      const isCaptain = i === 1;

      await prisma.player.create({
        data: {
          name: names[i],
          position: pos,
          isCaptain: isCaptain,
          isSubstitute: isSub,
          goalsScored: Math.floor(Math.random() * 8),
          teamId: team.id,
        },
      });
    }
  }

  const allTeams = await prisma.team.findMany();
  const allMatches: { homeTeamId: number; awayTeamId: number }[] = [];

  for (let i = 0; i < allTeams.length; i++) {
    for (let j = i + 1; j < allTeams.length; j++) {
      allMatches.push({ homeTeamId: allTeams[i].id, awayTeamId: allTeams[j].id });
      allMatches.push({ homeTeamId: allTeams[j].id, awayTeamId: allTeams[i].id });
    }
  }

  const shuffledMatches = shuffle(allMatches);

  const weekDays = [
    "2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18", "2026-06-19",
    "2026-06-22", "2026-06-23", "2026-06-24", "2026-06-25", "2026-06-26",
    "2026-06-29", "2026-06-30", "2026-07-01", "2026-07-02", "2026-07-03",
    "2026-07-06", "2026-07-07", "2026-07-08",
  ];

  const times = ["18:00", "20:00", "22:00"];

  for (let w = 0; w < weekDays.length; w++) {
    const weekMatches = shuffledMatches.slice(w * 5, (w + 1) * 5);
    for (const m of weekMatches) {
      const homeScore = randomScore();
      const awayScore = randomScore();
      const homeYellow = Math.floor(Math.random() * 3);
      const homeRed = Math.floor(Math.random() * 2);
      const awayYellow = Math.floor(Math.random() * 3);
      const awayRed = Math.floor(Math.random() * 2);
      await prisma.match.create({
        data: {
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
          homeScore, awayScore,
          homeYellowCards: homeYellow,
          homeRedCards: homeRed,
          awayYellowCards: awayYellow,
          awayRedCards: awayRed,
          date: weekDays[w],
          time: times[Math.floor(Math.random() * times.length)],
          week: w + 1,
          status: "played",
        },
      });
    }
  }

  console.log("Seed complete! 10 teams, 60 players, 90 matches created.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
