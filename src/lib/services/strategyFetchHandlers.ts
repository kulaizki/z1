import type { Match, PlayerStats, PlayerInsights, FetchResponse } from '$lib/types/strategy';
import { fetchSummary, fetchPlayerStats, fetchInsights } from './strategy'; // Assuming original services are in strategy.ts

export async function handleFetchSummaryLogic(matchData: Match[]): Promise<{ summary?: string | null; rateLimited?: boolean; waitTime?: number; error?: string }> {
  try {
    const response: FetchResponse | string = await fetchSummary(matchData);
    if (typeof response === 'object' && response.rateLimited) {
      return { rateLimited: true, waitTime: response.waitTime || 0 };
    }
    return { summary: typeof response === 'string' ? response : null };
  } catch (err) {
    console.error("Error fetching summary logic:", err);
    return { error: (err as Error).message };
  }
}

export async function handleFetchPlayerStatsLogic(id: string): Promise<{ stats?: PlayerStats; error?: string; invalidId?: boolean }> {
  try {
    const stats = await fetchPlayerStats(id);
    if (!stats) {
      return { invalidId: true };
    }
    return { stats };
  } catch (err) {
    console.error("Error fetching player stats logic:", err);
    return { error: (err as Error).message, invalidId: true };
  }
}

export async function handleFetchInsightsLogic(matchData: Match[]): Promise<{ insights?: PlayerInsights; rateLimited?: boolean; waitTime?: number; error?: string }> {
  try {
    const response: FetchResponse | { strengths: any[]; improvements: any[] } = await fetchInsights(matchData);
    if (typeof response === 'object' && 'rateLimited' in response && response.rateLimited) {
      return { rateLimited: true, waitTime: response.waitTime || 0 };
    }
    if (typeof response === 'object' && 'strengths' in response && 'improvements' in response) {
      return { insights: { strengths: response.strengths || [], improvements: response.improvements || [] } };
    }
    console.warn("Unexpected response structure from fetchInsights logic:", response);
    return { insights: null }; // Or handle as an error
  } catch (err) {
    console.error("Error fetching insights logic:", err);
    return { error: (err as Error).message };
  }
} 