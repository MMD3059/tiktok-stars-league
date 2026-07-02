import type { Team, Player, Match, Standing, Transfer, MatchEvent } from "./types";

const BASE = import.meta.env.VITE_API_URL || "/api";
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

const FETCH_TIMEOUT = 12000;

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${url}`, { headers, signal: controller.signal, ...options });
    if (!res.ok) {
      let msg = `API error: ${res.status}`;
      try { const body = await res.json(); if (body.error) msg = body.error; } catch {}
      throw new Error(msg);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFormData<T>(url: string, formData: FormData): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${url}`, { method: "POST", headers, signal: controller.signal, body: formData });
    if (!res.ok) {
      let msg = `API error: ${res.status}`;
      try { const body = await res.json(); if (body.error) msg = body.error; } catch {}
      throw new Error(msg);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Simple cache: returns cached data instantly then refreshes in background
const memCache = new Map<string, { data: any; ts: number }>();

async function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = memCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    // refresh in background if stale enough
    if (Date.now() - cached.ts > CACHE_TTL * 0.5) {
      fetcher().then(fresh => memCache.set(key, { data: fresh, ts: Date.now() })).catch(() => {});
    }
    return cached.data as T;
  }
  try {
    const data = await fetcher();
    memCache.set(key, { data, ts: Date.now() });
    return data;
  } catch (e) {
    // if network fails but we have stale cache, return it
    if (cached) return cached.data as T;
    throw e;
  }
}

function bustCache(key: string) {
  memCache.delete(key);
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    fetchJson<{ token: string; username: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // Upload
  uploadFile: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return fetchFormData<{ url: string }>("/admin/upload", fd);
  },

  // Teams
  getTeams: () => cachedFetch<Team[]>("teams", () => fetchJson<Team[]>("/teams")),
  getTeam: (id: number) => fetchJson<Team>(`/teams/${id}`),
  createTeam: (data: Partial<Team>) => {
    bustCache("teams");
    return fetchJson<Team>("/admin/teams", { method: "POST", body: JSON.stringify(data) });
  },
  updateTeam: (id: number, data: Partial<Team>) => {
    bustCache("teams");
    return fetchJson<Team>(`/admin/teams/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteTeam: (id: number) => {
    bustCache("teams");
    return fetchJson<{ ok: boolean }>(`/admin/teams/${id}`, { method: "DELETE" });
  },

  // Players
  getPlayers: () => fetchJson<Player[]>("/players"),
  getPlayer: (id: number) => fetchJson<Player>(`/players/${id}`),
  createPlayer: (data: Partial<Player>) =>
    fetchJson<Player>("/admin/players", { method: "POST", body: JSON.stringify(data) }),
  updatePlayer: (id: number, data: Partial<Player>) =>
    fetchJson<Player>(`/admin/players/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePlayer: (id: number) =>
    fetchJson<{ ok: boolean }>(`/admin/players/${id}`, { method: "DELETE" }),

  // Matches
  getMatches: () => cachedFetch<Match[]>("matches", () => fetchJson<Match[]>("/matches")),
  getMatch: (id: number) => fetchJson<Match>(`/matches/${id}`),
  createMatch: (data: Partial<Match>) => {
    bustCache("matches");
    return fetchJson<Match>("/admin/matches", { method: "POST", body: JSON.stringify(data) });
  },
  updateMatch: (id: number, data: Partial<Match>) => {
    bustCache("matches");
    return fetchJson<Match>(`/admin/matches/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteMatch: (id: number) => {
    bustCache("matches");
    return fetchJson<{ ok: boolean }>(`/admin/matches/${id}`, { method: "DELETE" });
  },

  // Standings
  getStandings: () => cachedFetch<Standing[]>("standings", () => fetchJson<Standing[]>("/standings")),

  // Top Scorers
  getTopScorers: () => cachedFetch<Player[]>("topscorers", () => fetchJson<Player[]>("/top-scorers")),

  // Standings (admin)
  updateStanding: (teamId: number, data: { points?: number; won?: number; drawn?: number; lost?: number; goalsFor?: number; goalsAgainst?: number }) => {
    bustCache("standings");
    return fetchJson<Team>(`/admin/standings/${teamId}`, { method: "PUT", body: JSON.stringify(data) });
  },

  // Value distribution
  distributeValue: (teamId: number) =>
    fetchJson<{ ok: boolean; share: number; count: number }>(`/admin/distribute-value/${teamId}`, { method: "POST" }),

  // Match Events
  getMatchEvents: (matchId: number) =>
    fetchJson<MatchEvent[]>(`/matches/${matchId}/events`),
  createMatchEvent: (matchId: number, data: { teamId: number; playerId: number; playerName: string; type: string }) =>
    fetchJson<MatchEvent>(`/admin/matches/${matchId}/events`, { method: "POST", body: JSON.stringify(data) }),
  deleteMatchEvent: (matchId: number, eventId: number) =>
    fetchJson<{ ok: boolean }>(`/admin/matches/${matchId}/events/${eventId}`, { method: "DELETE" }),

  // Search
  search: (q: string) =>
    fetchJson<{ teams: Team[]; players: Player[] }>(`/search?q=${encodeURIComponent(q)}`),

  // Head-to-Head
  getHeadToHead: (team1: number, team2: number) =>
    fetchJson<{ matches: Match[]; stats: { played: number; t1Wins: number; t2Wins: number; draws: number; t1Goals: number; t2Goals: number } }>(`/head-to-head/${team1}/${team2}`),

  // Admin change password
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchJson<{ ok: boolean }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Transfers
  getTransfers: () => cachedFetch<Transfer[]>("transfers", () => fetchJson<Transfer[]>("/transfers")),
  createTransfer: (data: Partial<Transfer>) => {
    bustCache("transfers");
    return fetchJson<Transfer>("/admin/transfers", { method: "POST", body: JSON.stringify(data) });
  },
  deleteTransfer: (id: number) => {
    bustCache("transfers");
    return fetchJson<{ ok: boolean }>(`/admin/transfers/${id}`, { method: "DELETE" });
  },
};
