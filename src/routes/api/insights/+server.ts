import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { Hero } from '$types/Hero';
import heroes from '$lib/data/heroes';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { matches } = await request.json();

    const heroMap = heroes.reduce((acc: Record<number, string>, hero: Hero) => {
      acc[hero.id] = hero.name;
      return acc;
    }, {});

    const matchesWithNames = matches.map((match: any) => ({
      ...match,
      hero_name: heroMap[match.hero_id] || 'Unknown Hero',
    }));

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Generate insights based on the matches
    const prompt = `
      Based on this user's Dota 2 matches, provide:
      1. 3-5 key strengths of the player with titles and descriptions
      2. 3-5 specific areas for improvement with recommendations
      
      Format the response as JSON like this:
      {
        "strengths": [
          {"title": "Strong Lane Presence", "description": "You consistently maintain good farm and lane control in the early game."},
          ...more examples
        ],
        "improvements": [
          {"area": "Map Awareness", "recommendation": "Check the minimap more frequently to avoid ganks and spot rotations."},
          ...more examples
        ]
      }
      
      Only provide the JSON with no additional text. Match data: ${JSON.stringify(matchesWithNames)}
    `;

    const result = await model.generateContent(prompt);
    const insightsText = result.response.text();
    
    const insights = JSON.parse(insightsText);

    return json(insights);
  } catch (error) {
    console.error('Error in insights API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ 
      strengths: [],
      improvements: [],
      error: errorMessage 
    }, { status: 500 });
  }
};