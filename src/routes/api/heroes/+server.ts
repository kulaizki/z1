import { json } from '@sveltejs/kit';
import { read } from '$app/server';

export const GET = async () => {
  try {
    const response = await read('src/lib/data/heroes.json');
    const data = await response.text();
    const heroes = JSON.parse(data);
    return json(heroes);
  } catch (error) {
    return json({ error: 'Failed to read heroes data' }, { status: 500 });
  }
};