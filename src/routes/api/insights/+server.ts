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

    const prompt = `
      Based on this user's Dota 2 matches, provide:
      1. 3-5 key strengths of the player with titles and descriptions
      2. 3-5 specific areas for improvement with recommendations
      
      Format the response as JSON like this:
      {
        "strengths": [
          {"title": "Strong Lane Presence", "description": "This player consistently maintain good farm and lane control in the early game."},
          {"title": "Example Title 2", "description": "Example Description 2"}
        ],
        "improvements": [
          {"area": "Map Awareness", "recommendation": "This player should check the minimap more frequently to avoid ganks and spot rotations."},
          {"area": "Example Area 2", "recommendation": "Example Recommendation 2"}
        ]
      }
      
      Only provide the JSON with no additional text.  The JSON should be enclosed in a single code block. Match data: ${JSON.stringify(matchesWithNames)}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;

    // Extract the response text from the AI model's output
    // and clean it up to remove any surrounding text or code blocks
    let insightsText = response.text();
    insightsText = insightsText.trim();

    // Remove markdown code block delimiters if present
    if (insightsText.startsWith('```json')) {
      insightsText = insightsText.slice(7, -3).trim();
    } else if (insightsText.startsWith('```')) {
      insightsText = insightsText.slice(3, -3).trim();
    }

    let insights;
    try {
      insights = JSON.parse(insightsText);
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      console.error('Raw Gemini Response:', insightsText); 
      return json({
        strengths: [],
        improvements: [],
        error: 'Invalid JSON format in AI response',
      }, { status: 500 });
    }

    // Filter out strengths and improvements with missing descriptions/recommendations
    if (insights && insights.strengths) {
      insights.strengths = insights.strengths.filter((strength: { title: string, description: string }) => strength.title && strength.description);
    }
    if (insights && insights.improvements) {
      insights.improvements = insights.improvements.filter((improvement: { area: string, recommendation: string }) => improvement.area && improvement.recommendation);
    }

    // Return the parsed insights as a JSON response
    return json(insights);
  } catch (error) {
    console.error('Error in insights API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({
      strengths: [],
      improvements: [],
      error: errorMessage,
    }, { status: 500 });
  }
};