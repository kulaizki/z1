import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { matches } = await request.json();

  try {
    const deepseekResponse = await fetch('https://api.deepseek.com/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({ matches })
    });

    if (!deepseekResponse.ok) {
      throw new Error('Failed to analyze matches with DeepSeek API');
    }

    const analysis = await deepseekResponse.json();
    return json(analysis);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};