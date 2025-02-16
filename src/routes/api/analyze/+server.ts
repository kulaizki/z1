import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import type { Hero } from '$types/Hero';
import heroes from '$lib/data/heroes';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the incoming request body
    const { matches } = await request.json();
    console.log('Received matches:', matches);

    const heroMap = heroes.reduce((acc: Record<number, string>, hero: Hero) => {
      acc[hero.id] = hero.name;
      return acc;
    }, {});

    // Map the matches to include hero names
    const matchesWithNames = matches.map((match: any) => ({
      ...match,
      hero_name: heroMap[match.hero_id] || 'Unknown Hero',
    }));
    console.log('Matches with hero names:', matchesWithNames);

    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Generate content based on the matches
    const prompt = `Based on this user's Dota 2 matches, provide a concise summary of their favorite playstyle or hero. Matches: ${JSON.stringify(matchesWithNames)}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return json({ summary });
  } catch (error) {
    console.error('Error in analyze API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: errorMessage }, { status: 500 });
  }
};
