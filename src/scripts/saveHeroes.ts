import fs from 'fs';
import fetch from 'node-fetch';

fetch('https://api.opendota.com/api/heroes')
	.then((response) => response.json())
	.then((data) => {
		const heroes = (data as any[]).map((hero) => ({
			id: hero.id,
			name: hero.localized_name
		}));
		fs.writeFileSync('heroes.json', JSON.stringify(heroes, null, 2));
		// console.log('heroes.json has been saved.');
	})
	.catch((error) => {
		console.error('Error fetching hero data:', error);
	});
