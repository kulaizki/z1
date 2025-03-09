export async function fetchMatches(dotaId: string) {
  try {
    const response = await fetch(`/api/matches/${dotaId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    return await response.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function fetchSummary(matches: any[]) {
  try {
    const response = await fetch(`/api/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ matches })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch analysis');
    }
    const data = await response.json();
    return data.summary|| 'No analysis available at this time.';
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function fetchInsights(matches: any[]) {
  try {
    const response = await fetch(`/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ matches })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    return await response.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export async function fetchPlayerStats(dotaId: string) {
  try {
    const response = await fetch(`/api/stats/${dotaId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch player stats');
    }
    return await response.json();
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export function handleKeyPress(event: KeyboardEvent, dotaId: string, fetchMatches: () => void) {
  if (event.key === 'Enter' && dotaId.trim()) {
    fetchMatches();
  }
}