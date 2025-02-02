import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import type { Hero } from '$types/Hero';

export const POST: RequestHandler = async ({ request }) => {
  const { matches } = await request.json();

  try {
    // Fetch the hero data from the /api/heroes endpoint
    const response = await fetch('/api/heroes');
    if (!response.ok) {
      throw new Error('Failed to fetch heroes');
    }
    console.log('response:', response);
    const heroes: Hero[] = await response.json();

    // Create a mapping of hero IDs to names
    const heroMap = heroes.reduce((acc: Record<number, string>, hero: Hero) => {
      acc[hero.id] = hero.name;
      return acc;
    }, {});

    // Map the matches to include hero names
    const matchesWithNames = matches.map((match: any) => ({
      ...match,
      hero_name: heroMap[match.hero_id] || 'Unknown Hero',
    }));

    // Initialize the Gemini API client with the imported API key
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Select the model you want to use
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Generate content based on the matches
    const prompt = `Based on this user's Dota 2 matches, provide a concise summary of their skill level, performance, favorite playstyle or hero, and areas for improvement. Matches: ${JSON.stringify(matchesWithNames)}`;
    const result = await model.generateContent(prompt);

    // Extract the generated text
    const analysis = result.response.text();

    return json({ analysis });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
