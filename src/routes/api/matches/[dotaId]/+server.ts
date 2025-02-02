import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
  const { dotaId } = params;

  try {
    const response = await fetch(`https://api.opendota.com/api/players/${dotaId}/recentMatches`);
    if (!response.ok) {
      return json({ error: 'Failed to fetch matches from OpenDota API' }, { status: 500 });
    }
    const matches = await response.json();

    return json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return json({ error: 'An error occurred while fetching matches' }, { status: 500 });
  }
};