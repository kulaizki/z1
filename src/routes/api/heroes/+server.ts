import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const GET = async () => {
  try {
    const filePath = path.resolve('src/lib/data/heroes.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const heroes = JSON.parse(data);
    return json(heroes);
  } catch (error) {
    return json({ error: 'Failed to read heroes data' }, { status: 500 });
  }
};
