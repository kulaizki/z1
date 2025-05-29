export type ProcessedMatch = {
  kda: number;
  gpm: number;
  xpm: number;
  hero_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  game_mode: number;
  lobby_type: number;
  version: number | null;
  kills: number;
  deaths: number;
  assists: number;
  hero_name: string;
  internalHeroName: string;
};

export type Match = Record<string, any>;

export type PlayerStats = {
  favoriteHeroes: Array<{id: number, name: string, games: number, winRate: number, internalName: string}>;
  roleDistribution: Array<{role: string, percentage: number}>;
  winRate: number;
  totalGames: number;
  avgKda: number;
  avgGpm: number;
  avgXpm: number;
  processedRecentMatches: ProcessedMatch[];
} | null;

export type PlayerInsights = {
  strengths: Array<{ title: string; description: string }>;
  improvements: Array<{ area: string; recommendation: string }>;
} | null;

export type FetchResponse = { rateLimited?: boolean; waitTime?: number; [key: string]: any }; 