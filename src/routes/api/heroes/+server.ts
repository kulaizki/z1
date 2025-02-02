import { json } from '@sveltejs/kit';

export const GET = async () => {
  try {
    const response = await fetch('https://api.opendota.com/api/heroes');
    if (!response.ok) {
      throw new Error('Failed to fetch hero data');
    }
    const heroes = await response.json();
    return json(heroes);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return new Response('An error occurred while fetching hero data', { status: 500 });
  }
};
