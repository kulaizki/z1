import { json } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { matches } = await request.json();

	try {
		// Initialize the Gemini API client with the imported API key
		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

		// Select the model you want to use
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

		// Generate content based on the matches
		// const prompt = `Based on this user's dota 2 matches, give a short and concise summary about the player's skill level, performance, favorite playstyle or hero, and what they can improve. ${JSON.stringify(matches)}`;
    const prompt = `tell me what is the hero id and the hero name of this player's second recent match ${JSON.stringify(matches)}`;
		const result = await model.generateContent(prompt);

		// Extract the generated text
		const analysis = result.response.text();

		return json({ analysis });
	} catch (error) {
		return json({ error: (error as Error).message }, { status: 500 });
	}
};
