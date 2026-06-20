import type { Team, Player, Match, Standing, Transfer } from "./types";

const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, { headers, ...options });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function fetchFormData<T>(url: string, formData: FormData): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, { method: "POST", headers, body: formData });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
  getTeams: () => fetchJson<Team[]>("/teams"),
  getTeam: (id: number) => fetchJson<Team>(`/teams/${id}`),
  createTeam: (data: Partial<Team>) =>
    fetchJson<Team>("/admin/teams", { method: "POST", body: JSON.stringify(data) }),
  updateTeam: (id: number, data: Partial<Team>) =>
    fetchJson<Team>(`/admin/teams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTeam: (id: number) =>
    fetchJson<{ ok: boolean }>(`/admin/teams/${id}`, { method: "DELETE" }),

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
  getMatches: () => fetchJson<Match[]>("/matches"),
  getMatch: (id: number) => fetchJson<Match>(`/matches/${id}`),
  createMatch: (data: Partial<Match>) =>
    fetchJson<Match>("/admin/matches", { method: "POST", body: JSON.stringify(data) }),
  updateMatch: (id: number, data: Partial<Match>) =>
    fetchJson<Match>(`/admin/matches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteMatch: (id: number) =>
    fetchJson<{ ok: boolean }>(`/admin/matches/${id}`, { method: "DELETE" }),

  // Standings
  getStandings: () => fetchJson<Standing[]>("/standings"),

  // Top Scorers
  getTopScorers: () => fetchJson<Player[]>("/top-scorers"),

  // Standings (admin)
  updateStanding: (teamId: number, data: { points?: number; won?: number; drawn?: number; lost?: number; goalsFor?: number; goalsAgainst?: number }) =>
    fetchJson<Team>(`/admin/standings/${teamId}`, { method: "PUT", body: JSON.stringify(data) }),

  // Value distribution
  distributeValue: (teamId: number) =>
    fetchJson<{ ok: boolean; share: number; count: number }>(`/admin/distribute-value/${teamId}`, { method: "POST" }),

  // Transfers
  getTransfers: () => fetchJson<Transfer[]>("/transfers"),
  createTransfer: (data: Partial<Transfer>) =>
    fetchJson<Transfer>("/admin/transfers", { method: "POST", body: JSON.stringify(data) }),
  deleteTransfer: (id: number) =>
    fetchJson<{ ok: boolean }>(`/admin/transfers/${id}`, { method: "DELETE" }),
};
