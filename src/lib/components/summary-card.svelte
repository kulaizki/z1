<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	let { summary } = $props<{summary: string}>();
</script>

<div
	class="w-full max-w-4xl rounded-lg border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-4 text-white shadow-md md:p-8"
>
	<h2 class="mb-4 text-2xl font-extrabold text-sky-400 [text-shadow:0_0_8px_rgba(56,189,248,0.6)] md:mb-6 md:text-3xl">
		Recent Games Summary
	</h2>
	<Markdown md={summary} />
</div>

<style>
	:global(p) {
		@apply mb-4 text-sm leading-relaxed text-gray-300 md:text-base;
	}

	/* Style the hero names with sky-400 */
	:global(strong) {
		@apply text-sky-400;
	}
</style>
