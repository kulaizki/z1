// src/routes/api/summary/+server.ts
import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';
import type { Hero } from '$types/Hero';
import heroes from '$lib/data/heroes';
import { RateLimiter } from '$lib/services/rateLimiter';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const rateLimiter = RateLimiter.getInstance();

		// Check if we're rate limited
		if (rateLimiter.isRateLimited()) {
			const waitTime = rateLimiter.getWaitTimeEstimate();
			return json(
				{
					error: 'Rate limited',
					waitTime,
					rateLimited: true
				},
				{ status: 429 }
			); // 429 Too Many Requests
		}

		const { matches } = await request.json();

		const heroMap = heroes.reduce((acc: Record<number, string>, hero: Hero) => {
			acc[hero.id] = hero.name;
			return acc;
		}, {});

		// Map the matches to include hero names
		const matchesWithNames = matches.map((match: any) => ({
			...match,
			hero_name: heroMap[match.hero_id] || 'Unknown Hero'
		}));

		// Acquire a token before making the API call
		await rateLimiter.acquireToken();

		// Initialize the Gemini API client
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

		// Generate content based on the matches
    const prompt = `Based on this user's Dota 2 matches, provide a concise summary of their favorite playstyle or hero. 
    Format all hero names as **HeroName** (bold) so they can be styled distinctly.
    Matches: ${JSON.stringify(matchesWithNames)}`;

		const result = await model.generateContent(prompt);
		const summary = result.response.text();

		return json({ summary });
	} catch (error) {
		console.error('Error in summary API:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: errorMessage }, { status: 500 });
	}
};
