import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			minWidth: {
				'4xl': '56rem'
			}
		}
	},

	plugins: []
} satisfies Config;
